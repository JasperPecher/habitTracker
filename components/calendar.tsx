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
    Habbit: { name: string };
  }[];
  currentMonth: Date;
  setCurrentMonth: (newDate: Date) => void;
}

export function Calendar({
  onDateSelect,
  selectedDate,
  entries,
  currentMonth,
  setCurrentMonth,
}: CalendarProps) {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const hasHabits = (date: Date): boolean => {
    const dateKey = format(date, "yyyy-MM-dd");
    return entries?.some(
      (item) => format(item?.date, "yyyy-MM-dd") === dateKey
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}

        {days.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentMonth);
          const isSelected = selectedDate && isSameDay(day, selectedDate);
          const isTodayDate = isToday(day);
          const isFutureDate = isFuture(day) && !isToday(day);
          const dayHasHabits = hasHabits(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => !isFutureDate && onDateSelect(day)}
              disabled={isFutureDate}
              className={cn(
                "relative aspect-square rounded-lg p-2 text-sm font-medium transition-all",
                "hover:bg-indigo-50 dark:hover:bg-indigo-900 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                isCurrentMonth
                  ? "text-gray-900 dark:text-gray-50"
                  : "text-gray-400",
                isSelected && "bg-indigo-600 text-white hover:bg-indigo-700",
                isTodayDate && !isSelected && "ring-2 ring-indigo-600",
                isFutureDate &&
                  "cursor-not-allowed opacity-40 hover:bg-transparent",
                !isSelected && dayHasHabits && isCurrentMonth && "bg-green-400"
              )}
            >
              {format(day, "d")}
              {dayHasHabits && !isSelected && (
                <span className="absolute bottom-1 left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-green-600" />
              )}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-green-600" />
          <span>Has habits</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded ring-2 ring-indigo-600" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
}
