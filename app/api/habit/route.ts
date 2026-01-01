import { authAPIProvider } from "@/lib/authAPIProvider";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Habit = {
  name: string;
  color: string;
};
export const POST = async (request: Request) => {
  const auth = await authAPIProvider();
  if (auth === false) {
    return NextResponse.json("You are not authenticated!", {
      status: 401,
    });
  }
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
