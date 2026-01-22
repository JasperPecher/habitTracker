"use client";

import { cn, convertToFloat } from "@/lib/utils";

import { format, isFuture, isToday } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Minus, Plus, Save } from "lucide-react";

interface HabitListProps {
  selectedDate: Date;
  done: {
    id: number;
    date: Date;
    Habit: { name: string; color: string; type: string };
    value: number;
  }[];
  setDone: (
    done: {
      id: number;
      date: Date;
      Habit: { name: string; color: string; type: string };
      value: number;
    }[],
  ) => void;
  habits: {
    name: string;
    color: string;
    type: string;
  }[];
  onUpdate: (date: Date, habit: string, value?: number) => void;
}

export function HabitList({
  selectedDate,
  done,
  setDone,
  habits,
  onUpdate,
}: HabitListProps) {
  const isFutureDate = isFuture(selectedDate) && !isToday(selectedDate);
  const handleToggleHabit = (habit: string) => {
    if (isFutureDate) return;
    onUpdate(selectedDate, habit);
  };

  const handleDistanceInputChange = (newValue: number, habitName: string) => {
    if (isFutureDate) return;
    const updatedValues = [...done];
    const index = updatedValues.findIndex(
      (item) => item.Habit.name === habitName,
    );

    if (index === -1) {
      updatedValues.push({
        id: 1,
        date: new Date(),
        value: newValue,
        Habit: { color: "", name: habitName, type: "distance" },
      });
    } else {
      updatedValues[index].value = newValue; // Update the specific index
    }
    setDone(updatedValues);
  };

  const handlePlusCounterHabit = (habit: string) => {
    if (isFutureDate) return;
    onUpdate(selectedDate, habit, 1);
  };
  const handleMinusCounterHabit = (habit: string) => {
    if (isFutureDate) return;
    onUpdate(selectedDate, habit, -1);
  };
  const handleDistanceHabit = (habit: string) => {
    if (isFutureDate) return;
    const newValueIndex = done.findIndex((item) => item.Habit.name === habit);

    onUpdate(selectedDate, habit, done[newValueIndex].value);
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
                  {habit.type === "boolean" ? (
                    <>
                      <Checkbox
                        id={habit.name}
                        className="cursor-pointer"
                        checked={done.some(
                          (item) => item.Habit.name === habit.name,
                        )}
                        onCheckedChange={() => handleToggleHabit(habit.name)}
                      />
                      <Label
                        htmlFor={habit.name}
                        className={cn(
                          "flex-1 cursor-pointer text-xs font-medium leading-relaxed",
                          done.some((item) => item.Habit.name === habit.name) &&
                            "text-gray-500 line-through",
                        )}
                      >
                        {habit.name}
                      </Label>
                    </>
                  ) : habit.type === "counter" ? (
                    <>
                      <span className="text-xs">
                        {done.filter(
                          (item) => item.Habit.name === habit.name,
                        )[0]?.value || 0}
                      </span>

                      <Label
                        htmlFor={habit.name}
                        className="flex-1 text-xs font-medium leading-relaxed"
                      >
                        {habit.name}
                      </Label>
                      <Button
                        className="w-5 h-5"
                        onClick={() => handleMinusCounterHabit(habit.name)}
                      >
                        <Minus />
                      </Button>
                      <Button
                        className="w-5 h-5"
                        onClick={() => handlePlusCounterHabit(habit.name)}
                      >
                        <Plus />
                      </Button>
                    </>
                  ) : habit.type === "distance" ? (
                    <>
                      <Label
                        htmlFor={habit.name}
                        className="flex-1 text-xs font-medium leading-relaxed"
                      >
                        {habit.name}
                      </Label>
                      <form onSubmit={() => handleDistanceHabit(habit.name)}>
                        <Input
                          type="text"
                          placeholder="km"
                          className="w-17 mr-1"
                          onChange={(e) =>
                            handleDistanceInputChange(
                              Number(convertToFloat(e.target.value)),
                              habit.name,
                            )
                          }
                          defaultValue={
                            done
                              .find((item) => item.Habit.name === habit.name)
                              ?.value.toFixed(2) || ""
                          }
                        />
                        <Button className="w-5 h-5" type="submit">
                          <Save />
                        </Button>
                      </form>
                    </>
                  ) : (
                    <Label
                      htmlFor={habit.name}
                      className="flex-1 text-xs font-medium leading-relaxed"
                    >
                      {habit.name}
                    </Label>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
