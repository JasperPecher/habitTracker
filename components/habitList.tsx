"use client";

import { cn } from "@/lib/utils";

import { useState } from "react";
import { format, isFuture, isToday } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "./ui/label";

interface HabitListProps {
  selectedDate: Date;
  done: string[];
  habits: string[];
  onUpdate: (date: Date, habit: string) => void;
}

export function HabitList({
  selectedDate,
  done,
  habits,
  onUpdate,
}: HabitListProps) {
  const isFutureDate = isFuture(selectedDate) && !isToday(selectedDate);

  const handleToggleHabit = (habit: string) => {
    if (isFutureDate) return;
    onUpdate(selectedDate, habit);
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="mb-1 text-xl font-semibold text-gray-900">
          {format(selectedDate, "MMMM d, yyyy")}
        </h3>
        {isFutureDate ? (
          <p className="text-sm text-gray-500">Cannot track future dates</p>
        ) : (
          <p className="text-sm text-gray-500">
            {done.length} {done.length === 1 ? "habit" : "habits"} completed
          </p>
        )}
      </div>

      {isFutureDate ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center text-sm text-amber-800">
          You can only track habits for today and past days
        </div>
      ) : (
        <>
          <div className="max-h-100 space-y-2 overflow-y-auto">
            {habits.map((habit) => (
              <div
                key={habit}
                className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white dark:bg-black p-3 transition-colors hover:bg-gray-50"
              >
                <div className="flex flex-1 items-center gap-3">
                  <Checkbox
                    id={habit}
                    checked={done.includes(habit)}
                    onCheckedChange={() => handleToggleHabit(habit)}
                  />
                  <Label
                    htmlFor={habit}
                    className={cn(
                      "flex-1 cursor-pointer text-sm font-medium leading-relaxed",
                      done.includes(habit) && "text-gray-500 line-through"
                    )}
                  >
                    {habit}
                  </Label>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
