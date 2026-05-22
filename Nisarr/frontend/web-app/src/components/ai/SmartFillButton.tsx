import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { smartFillForm } from '@/ai/features/smart-fill';
import { toast } from "sonner";

interface SmartFillButtonProps<T> {
    onFill: (data: T) => void;
    schemaDescription: string;
    triggerLabel?: string;
    dialogTitle?: string;
    dialogDescription?: string;
    exampleText?: string;
}

export function SmartFillButton<T>({
    onFill,
    schemaDescription,
    triggerLabel = "Magic Fill",
    dialogTitle = "Smart Form Fill",
    dialogDescription = "Paste any text, and AI will fill the form for you.",
    exampleText = "e.g., Bought a Logitech mouse for 500tk from Amazon"
}: SmartFillButtonProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleFill = async () => {
        if (!input.trim()) return;
        setIsLoading(true);
        try {
            const data = await smartFillForm<T>(input, schemaDescription);
            onFill(data);
            setIsOpen(false);
            setInput("");
            toast.success("Form filled successfully! ✨");
        } catch (error) {
            toast.error("Failed to process text. Try being more specific.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2 border-purple-500/50 text-purple-500 hover:bg-purple-500/10 hover:text-purple-600">
                    <Sparkles className="w-4 h-4" />
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        {dialogTitle}
                    </DialogTitle>
                    <DialogDescription>
                        {dialogDescription}
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <Textarea
                        placeholder={exampleText}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="min-h-[100px]"
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button
                        onClick={handleFill}
                        disabled={isLoading || !input.trim()}
                        className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {isLoading ? "Thinking..." : "Fill Form"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
