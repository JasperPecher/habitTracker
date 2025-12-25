"use client";

import { cn } from "@/lib/utils";

import { format, isFuture, isToday } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "./ui/label";

interface HabitListProps {
  selectedDate: Date;
  done: string[];
  habits: {
    name: string;
    color: string;
  }[];
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
    <div className="space-y-3">
      <div>
        <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-gray-100">
          {format(selectedDate, "MMMM d, yyyy")}
        </h3>
        {isFutureDate ? (
          <p className="text-xs text-gray-500">Cannot track future dates</p>
        ) : (
          <p className="text-xs text-gray-500">
            {done.length} {done.length === 1 ? "habit" : "habits"} completed
          </p>
        )}
      </div>

      {isFutureDate ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-center text-xs text-amber-800">
          You can only track habits for today and past days
        </div>
      ) : (
        <>
          <div className="max-h-112 space-y-2 overflow-y-auto">
            {habits.map((habit) => (
              <div
                key={habit.name}
                className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white dark:bg-black p-2 transition-colors hover:bg-gray-50"
              >
                <div className="flex flex-1 items-center gap-2">
                  <Checkbox
                    id={habit.name}
                    checked={done.includes(habit.name)}
                    onCheckedChange={() => handleToggleHabit(habit.name)}
                  />
                  <Label
                    htmlFor={habit.name}
                    className={cn(
                      "flex-1 cursor-pointer text-xs font-medium leading-relaxed",
                      done.includes(habit.name) && "text-gray-500 line-through"
                    )}
                  >
                    {habit.name}
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
