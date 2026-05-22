import { useState, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface DatePickerProps {
    value: string; // YYYY-MM-DD format
    onChange: (date: string) => void;
    placeholder?: string;
    className?: string;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({ value, onChange, placeholder = "Select date", className }: DatePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        if (value) return new Date(value + "T12:00:00");
        return new Date();
    });
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse the value
    const selectedDate = value ? new Date(value + "T12:00:00") : null;

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get calendar days for current view month
    const getDaysInMonth = () => {
        const year = viewDate.getFullYear();
        const month = viewDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: (Date | null)[] = [];

        // Add empty slots for days before the first day of month
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add all days of the month
        for (let d = 1; d <= lastDay.getDate(); d++) {
            days.push(new Date(year, month, d));
        }

        return days;
    };

    const handleSelectDate = (date: Date) => {
        const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        onChange(formatted);
        setIsOpen(false);
    };

    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    const formatDisplayDate = () => {
        if (!selectedDate) return placeholder;
        return `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`;
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    const isSelected = (date: Date) => {
        if (!selectedDate) return false;
        return date.getDate() === selectedDate.getDate() &&
            date.getMonth() === selectedDate.getMonth() &&
            date.getFullYear() === selectedDate.getFullYear();
    };

    return (
        <>
            {/* Backdrop blur overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}

            <div ref={containerRef} className={cn("relative", className)}>
                {/* Trigger Button */}
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-md border border-input bg-background text-sm hover:bg-accent transition-colors"
                >
                    <span className={selectedDate ? "text-foreground" : "text-muted-foreground"}>
                        {formatDisplayDate()}
                    </span>
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Dropdown Calendar - Opens CENTERED */}
                {isOpen && (
                    <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-3 rounded-lg border bg-popover shadow-lg min-w-[280px]">
                        {/* Month/Year Navigation */}
                        <div className="flex items-center justify-between mb-3">
                            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-7 w-7">
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <span className="font-medium">
                                {MONTHS[viewDate.getMonth()]} {viewDate.getFullYear()}
                            </span>
                            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-7 w-7">
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1 mb-1">
                            {DAYS.map(day => (
                                <div key={day} className="text-center text-xs text-muted-foreground font-medium py-1">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="grid grid-cols-7 gap-1">
                            {getDaysInMonth().map((date, i) => (
                                <div key={i} className="aspect-square">
                                    {date ? (
                                        <button
                                            type="button"
                                            onClick={() => handleSelectDate(date)}
                                            className={cn(
                                                "w-full h-full rounded-md text-sm transition-colors",
                                                isSelected(date)
                                                    ? "bg-primary text-primary-foreground"
                                                    : isToday(date)
                                                        ? "bg-accent text-accent-foreground font-semibold"
                                                        : "hover:bg-accent"
                                            )}
                                        >
                                            {date.getDate()}
                                        </button>
                                    ) : null}
                                </div>
                            ))}
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-3 pt-3 border-t flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => {
                                    const today = new Date();
                                    handleSelectDate(today);
                                }}
                            >
                                Today
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => {
                                    onChange("");
                                    setIsOpen(false);
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
