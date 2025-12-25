import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Habit = {
  name: string;
  color: string;
};
export const POST = async (request: Request) => {
  const body: Habit = await request.json();

  try {
    const habit = await prisma.habit.create({
      data: {
        name: body.name,
        color: body.color,
      },
    });
    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.log(error);
  }
};
