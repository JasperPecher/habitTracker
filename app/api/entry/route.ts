import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Entry = {
  habit: string;
  date: string;
};
export const POST = async (request: Request) => {
  const body: Entry = await request.json();

  const startDate = new Date(body.date); // Beginning of the day in UTC
  const endDate = new Date(body.date);
  endDate.setUTCDate(endDate.getUTCDate() + 1); // Move to the next day
  try {
    const entry = await prisma.entry.findFirst({
      where: {
        date: {
          gte: startDate, // Start of the specified date
          lt: endDate, // Start of the next day
        },
        Habbit: { name: body.habit },
      },
      select: { id: true },
    });

    if (entry !== null) {
      await prisma.entry.delete({
        where: { id: entry.id },
      });
    } else {
      const habitId = await prisma.habit.findFirstOrThrow({
        where: { name: body.habit },
        select: { id: true },
      });

      await prisma.entry.create({
        data: {
          date: new Date(body.date),
          habitId: habitId.id,
        },
      });
    }
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.log(error);
  }
};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const month = Number(url.searchParams.get("month"));
  const year = Number(url.searchParams.get("year"));

  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 1));

  const entries = await prisma.entry.findMany({
    select: {
      id: true,
      date: true,
      Habbit: { select: { name: true, color: true } },
    },
    where: {
      date: {
        gte: startDate, // greater than or equal to start of month
        lt: endDate, // less than start of next month } },
      },
    },
  });
  const habits = await prisma.habit.findMany({
    select: {
      name: true,
      color: true,
    },
  });

  return NextResponse.json(
    {
      entries: entries,
      habits: habits.map((item) => {
        return { name: item.name, color: item.color };
      }),
    },
    { status: 200 }
  );
}
