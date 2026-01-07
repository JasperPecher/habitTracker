import { authAPIProvider } from "@/lib/authAPIProvider";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Entry = {
  habit: string;
  date: string;
  value: number;
};
export const POST = async (request: Request) => {
  const body: Entry = await request.json();
  const auth = await authAPIProvider();
  if (auth === false) {
    return NextResponse.json("You are not authenticated!", {
      status: 401,
    });
  }

  const startDate = new Date(body.date);
  startDate.setHours(0, 0, 0, 0); // Beginning of the day in UTC
  const endDate = new Date(body.date);
  endDate.setHours(24, 0, 0, 0); // End of the day in UTC

  try {
    const entry = await prisma.entry.findFirst({
      where: {
        date: {
          gte: startDate, // Start of the specified date
          lt: endDate, // Start of the next day
        },
        Habit: { name: body.habit },
        userId: auth.user.id,
      },
      select: { id: true, value: true, Habit: { select: { type: true } } },
    });

    if (entry !== null && entry.Habit.type === "boolean") {
      await prisma.entry.delete({
        where: { id: entry.id },
      });
    } else if (
      entry !== null &&
      entry.Habit.type === "counter" &&
      entry.value != null
    ) {
      await prisma.entry.update({
        where: { id: entry.id },
        data: { value: entry.value + body.value },
      });
    } else if (
      entry !== null &&
      entry?.Habit.type === "distance" &&
      entry.value != null
    ) {
      await prisma.entry.update({
        where: { id: entry.id },
        data: { value: body.value },
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
          value: body.value,
          userId: auth.user.id,
        },
      });
    }
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.log(error);
  }
};

export async function GET(req: Request) {
  const auth = await authAPIProvider();
  if (auth === false) {
    return NextResponse.json("You are not authenticated!", {
      status: 401,
    });
  }
  const url = new URL(req.url);
  const month = Number(url.searchParams.get("month"));
  const year = Number(url.searchParams.get("year"));

  const startDate = new Date(Date.UTC(year, month, 1));
  const endDate = new Date(Date.UTC(year, month + 1, 1));

  const entries = await prisma.entry.findMany({
    select: {
      id: true,
      date: true,
      value: true,
      Habit: { select: { name: true, color: true, type: true } },
    },
    where: {
      date: {
        gte: startDate, // greater than or equal to start of month
        lt: endDate, // less than start of next month } },
      },
      userId: auth.user.id,
    },
  });
  const habits = await prisma.habit.findMany({
    select: {
      name: true,
      color: true,
      type: true,
    },
  });

  return NextResponse.json(
    {
      entries: entries,
      habits: habits,
    },
    { status: 200 }
  );
}
