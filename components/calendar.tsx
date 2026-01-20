"use client";

import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  isFuture,
} from "date-fns";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarProps {
  onDateSelect: (date: Date) => void;
  selectedDate: Date | null;
  entries: {
    id: number;
    date: Date;
    Habit: { name: string; color: string };
  }[];
  habits: {
    name: string;
    color: string;
  }[];
  currentMonth: Date;
  setCurrentMonth: (newDate: Date) => void;
}

export function Calendar({
  onDateSelect,
  selectedDate,
  entries,
  habits,
  currentMonth,
  setCurrentMonth,
}: CalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const habitColors = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const colorArray = entries
      .filter((item) => format(item.date, "yyyy-MM-dd") === dateKey)
      .map((item) => item.Habit.color); // Filter by the specified date
    return colorArray;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={handlePrevMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 bg-transparent"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500"
          >
            {day.slice(0, 1)}
          </div>
        ))}

        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const isFutureDate = isFuture(day) && !isToday(day);
          const dayHabitColors = habitColors(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isFutureDate && onDateSelect(day)}
              disabled={isFutureDate}
              className={cn(
                "relative aspect-square rounded p-1 text-xs font-medium transition-all",
                "hover:bg-indigo-50 dark:hover:bg-indigo-900 focus:outline-none focus:ring-1 focus:ring-indigo-500",
                isCurrentMonth
                  ? "text-gray-900 dark:text-gray-50"
                  : "text-gray-400",
                isSelected && "bg-indigo-600 text-white hover:bg-indigo-700",
                isTodayDate && !isSelected && "ring-1 ring-indigo-600",
                isFutureDate &&
                  "cursor-not-allowed opacity-40 hover:bg-transparent",
                !isSelected &&
                  isCurrentMonth &&
                  "bg-slate-400 dark:bg-slate-800"
              )}
            >
              <span>{format(day, "d")}</span>
              <div className="absolute inset-x-0 bottom-0.5 flex items-center justify-center gap-2">
                {dayHabitColors.map((color) => (
                  <span
                    key={color}
                    className="h-1 w-1 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3 text-xs text-gray-600">
        <div className="flex items-center gap-1.5">
          {habits.map((habit) => (
            <div key={habit.name} className="flex items-center gap-1">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: habit.color }}
              />
              <span className="mr-2">{habit.name}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded ring-1 ring-indigo-600" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
