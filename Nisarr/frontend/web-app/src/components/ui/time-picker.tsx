import { useState, useRef, useEffect } from "react";
import { Clock, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface TimePickerProps {
    value: string; // HH:MM format (24h)
    onChange: (time: string) => void;
    placeholder?: string;
    className?: string;
}

export function TimePicker({ value, onChange, placeholder = "Select time", className }: TimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Parse value into hours and minutes
    const [hours, minutes] = value ? value.split(":").map(Number) : [12, 0];
    const isPM = hours >= 12;
    const displayHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;

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

    const formatDisplayTime = () => {
        if (!value) return placeholder;
        const h = displayHours;
        const m = String(minutes).padStart(2, '0');
        const period = isPM ? "PM" : "AM";
        return `${h}:${m} ${period}`;
    };

    const updateTime = (newHours: number, newMinutes: number, newIsPM: boolean) => {
        let h24 = newHours;
        if (newIsPM && newHours !== 12) h24 = newHours + 12;
        if (!newIsPM && newHours === 12) h24 = 0;
        const formatted = `${String(h24).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
        onChange(formatted);
    };

    const incrementHours = () => {
        const newHours = displayHours >= 12 ? 1 : displayHours + 1;
        updateTime(newHours, minutes, isPM);
    };

    const decrementHours = () => {
        const newHours = displayHours <= 1 ? 12 : displayHours - 1;
        updateTime(newHours, minutes, isPM);
    };

    const incrementMinutes = () => {
        const newMinutes = minutes >= 55 ? 0 : minutes + 5;
        updateTime(displayHours, newMinutes, isPM);
    };

    const decrementMinutes = () => {
        const newMinutes = minutes <= 0 ? 55 : minutes - 5;
        updateTime(displayHours, newMinutes, isPM);
    };

    const togglePeriod = () => {
        updateTime(displayHours, minutes, !isPM);
    };

    // Quick time presets
    const presets = [
        { label: "9:00 AM", value: "09:00" },
        { label: "12:00 PM", value: "12:00" },
        { label: "3:00 PM", value: "15:00" },
        { label: "6:00 PM", value: "18:00" },
    ];

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
                    <span className={value ? "text-foreground" : "text-muted-foreground"}>
                        {formatDisplayTime()}
                    </span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                </button>

                {/* Dropdown Time Picker - Opens CENTERED */}
                {isOpen && (
                    <div className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 p-4 rounded-lg border bg-popover shadow-lg min-w-[200px]">
                        {/* Time Spinners */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                            {/* Hours */}
                            <div className="flex flex-col items-center">
                                <Button variant="ghost" size="icon" onClick={incrementHours} className="h-7 w-7">
                                    <ChevronUp className="w-4 h-4" />
                                </Button>
                                <div className="w-12 h-10 flex items-center justify-center text-xl font-semibold bg-accent rounded-md">
                                    {String(displayHours).padStart(2, '0')}
                                </div>
                                <Button variant="ghost" size="icon" onClick={decrementHours} className="h-7 w-7">
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>

                            <span className="text-xl font-bold">:</span>

                            {/* Minutes */}
                            <div className="flex flex-col items-center">
                                <Button variant="ghost" size="icon" onClick={incrementMinutes} className="h-7 w-7">
                                    <ChevronUp className="w-4 h-4" />
                                </Button>
                                <div className="w-12 h-10 flex items-center justify-center text-xl font-semibold bg-accent rounded-md">
                                    {String(minutes).padStart(2, '0')}
                                </div>
                                <Button variant="ghost" size="icon" onClick={decrementMinutes} className="h-7 w-7">
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>

                            {/* AM/PM Toggle */}
                            <div className="flex flex-col items-center">
                                <Button variant="ghost" size="icon" onClick={togglePeriod} className="h-7 w-7">
                                    <ChevronUp className="w-4 h-4" />
                                </Button>
                                <button
                                    type="button"
                                    onClick={togglePeriod}
                                    className="w-12 h-10 flex items-center justify-center text-sm font-semibold bg-primary text-primary-foreground rounded-md"
                                >
                                    {isPM ? "PM" : "AM"}
                                </button>
                                <Button variant="ghost" size="icon" onClick={togglePeriod} className="h-7 w-7">
                                    <ChevronDown className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="grid grid-cols-2 gap-2 pt-3 border-t">
                            {presets.map(preset => (
                                <Button
                                    key={preset.value}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs"
                                    onClick={() => {
                                        onChange(preset.value);
                                        setIsOpen(false);
                                    }}
                                >
                                    {preset.label}
                                </Button>
                            ))}
                        </div>

                        {/* Clear & Save Buttons */}
                        <div className="flex gap-2 mt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex-1 text-xs text-muted-foreground"
                                onClick={() => {
                                    onChange("");
                                    setIsOpen(false);
                                }}
                            >
                                Clear
                            </Button>
                            <Button
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={() => setIsOpen(false)}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
