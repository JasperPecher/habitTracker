import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Entry = {
  habit: string;

  value: number;
  username: string;
  secret: string;
};
export const POST = async (request: Request) => {
  const body: Entry = await request.json();
  if (body.secret !== process.env.HOMEASSISTANT_SECRET) {
    return NextResponse.json("You are not authenticated!", {
      status: 401,
    });
  }

  const startDate = new Date(); // Beginning of the day in UTC
  const endDate = new Date();
  endDate.setUTCDate(endDate.getUTCDate() + 1); // Move to the next day
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: body.username,
      },
      select: { id: true },
    });
    const entry = await prisma.entry.findFirst({
      where: {
        date: {
          gte: startDate, // Start of the specified date
          lt: endDate, // Start of the next day
        },
        Habit: { name: body.habit },
        userId: user?.id,
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
    } else {
      const habitId = await prisma.habit.findFirstOrThrow({
        where: { name: body.habit },
        select: { id: true },
      });

      await prisma.entry.create({
        data: {
          date: new Date(),
          habitId: habitId.id,
          value: body.value,
          userId: user?.id || "unknown",
        },
      });
    }
    return NextResponse.json(entry, { status: 201 });
  } catch (error) {
    console.log(error);
  }
};
