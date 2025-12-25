import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Entry = {
  name: string;
  date: string;
};
export const POST = async (request: Request) => {
  const body: Entry = await request.json();
  // Create Date object for the start of the specified date in UTC
  const startDate = new Date(body.date + "T00:00:00.000Z"); // Beginning of the day in UTC

  // Create Date object for the start of the next day in UTC
  const endDate = new Date(body.date + "T00:00:00.000Z");
  endDate.setUTCDate(endDate.getUTCDate() + 1); // Move to the next day

  try {
    const entry = await prisma.entry.findFirst({
      where: {
        date: {
          gte: startDate, // Start of the specified date
          lt: endDate, // Start of the next day
        },
        Habbit: { name: body.name },
      },
    });
    console.log(entry);

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
      Habbit: { select: { name: true } },
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
    },
  });

  return NextResponse.json(
    { entries: entries, habits: habits.map((item) => item.name) },
    { status: 200 }
  );
}
