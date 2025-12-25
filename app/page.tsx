"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { HabitList } from "@/components/habitList";
import { Calendar } from "@/components/calendar";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

type Entry = {
  id: number;
  date: Date;
  Habbit: { name: string };
};

type ApiResponse = {
  data: {
    entries: Array<Entry>;
    habits: string[];
  };
};

export default function HabitTracker() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [entries, setEntries] = useState<Entry[]>([]);
  const [habits, setHabits] = useState([""]);
  const router = useRouter();

  const { refetch } = useQuery<ApiResponse>({
    queryKey: ["table-data", currentMonth],
    queryFn: async () => {
      const params = new URLSearchParams({
        month: String(currentMonth.getUTCMonth()),
        year: String(currentMonth.getUTCFullYear()),
      }).toString();
      const url = "/api/entry" + "?" + params;
      const response = (await axios.get(url)) as ApiResponse;
      setEntries(response.data.entries);
      setHabits(response.data.habits);
      return response;
    },
  });

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleHabitsUpdate = async (date: Date, habit: string) => {
    const dateKey = format(date, "yyyy-MM-dd");
    try {
      await axios.post("/api/entry", {
        date: dateKey,
        habit: habit,
      });
    } catch (error) {
      console.log(error);
    } finally {
      router.refresh();
      refetch();
    }
  };

  const getHabitsForDate = (date: Date): string[] => {
    const dateKey = format(date, "yyyy-MM-dd");
    const doneHabits = entries
      .filter((item) => format(item.date, "yyyy-MM-dd") === dateKey) // Filter by the specified date
      .map((item) => item.Habbit.name);
    return doneHabits;
  };

  return (
    <main className="h-full bg-gray-50 dark:bg-gray-800 p-4">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-4">
            <Calendar
              onDateSelect={handleDateSelect}
              selectedDate={selectedDate}
              entries={entries}
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
          </Card>
          <Card className="p-4">
            <HabitList
              selectedDate={selectedDate}
              done={getHabitsForDate(selectedDate)}
              habits={habits}
              onUpdate={handleHabitsUpdate}
            />
          </Card>
        </div>
      </div>
    </main>
  );
}
