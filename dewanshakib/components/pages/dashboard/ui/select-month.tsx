"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const months = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

export default function SelectMonth() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [month, setMonth] = useState<string>((new Date().getMonth() + 1).toString());

  useEffect(() => {
    const monthParam = searchParams.get("month");
    if (monthParam) {
      setMonth(monthParam);
    }
  }, [searchParams]);

  const handleMonthChange = (value: string) => {
    setMonth(value);
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", value);
    router.push(`/dashboard?${params.toString()}`);
  };

  return (
    <Select value={month} onValueChange={handleMonthChange}>
      <SelectTrigger className="w-[140px]" aria-label="Select month">
        <SelectValue placeholder="Select month" />
      </SelectTrigger>
      <SelectContent>
        {months.map((m) => (
          <SelectItem key={m.value} value={m.value.toString()} className="rounded-lg">
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}