'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Picker from '@emoji-mart/react';
import data from '@emoji-mart/data';
import { Smile } from 'lucide-react';

interface Props {
  onSend: (content: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
}

export default function MessageInput({ onSend, onTypingStart, onTypingStop }: Props) {
  const [value, setValue] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const typingRef = useRef(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    if (showPicker) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showPicker]);

  const handleTyping = useCallback(
    (text: string) => {
      if (text && !typingRef.current) {
        typingRef.current = true;
        onTypingStart();
      }
      if (typingTimer.current) clearTimeout(typingTimer.current);
      typingTimer.current = setTimeout(() => {
        typingRef.current = false;
        onTypingStop();
      }, 1500);
    },
    [onTypingStart, onTypingStop]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    handleTyping(e.target.value);
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingRef.current = false;
    onTypingStop();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
    if (e.key === 'Escape') {
      setShowPicker(false);
    }
  };

  const handleEmojiSelect = (emoji: { native: string }) => {
    const input = inputRef.current;
    if (!input) {
      setValue((prev) => prev + emoji.native);
      return;
    }
    const start = input.selectionStart ?? value.length;
    const end = input.selectionEnd ?? value.length;
    const newValue = value.slice(0, start) + emoji.native + value.slice(end);
    setValue(newValue);
    handleTyping(newValue);
    // Restore cursor position after emoji insertion
    requestAnimationFrame(() => {
      input.focus();
      const pos = start + emoji.native.length;
      input.setSelectionRange(pos, pos);
    });
  };

  return (
    <div className="relative flex items-center gap-2 border-t border-border/40 bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:gap-3 sm:px-6 sm:py-4">
      {/* Emoji Picker Popup */}
      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-4 z-50 mb-2 overflow-hidden rounded-2xl shadow-2xl sm:left-6"
        >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
            maxFrequentRows={2}
            perLine={8}
          />
        </div>
      )}

      {/* Emoji Toggle Button */}
      <Button
        id="emoji-btn"
        type="button"
        variant="ghost"
        size="sm"
        onClick={() => setShowPicker((prev) => !prev)}
        className={`h-10 w-10 shrink-0 rounded-full p-0 text-muted-foreground transition-colors hover:bg-indigo-500/10 hover:text-indigo-400 ${showPicker ? 'bg-indigo-500/15 text-indigo-400' : ''}`}
        aria-label="Open emoji picker"
      >
        <Smile size={20} />
      </Button>

      {/* Message Input */}
      <Input
        id="message-input"
        ref={inputRef}
        placeholder="Type a message..."
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="h-11 flex-1 rounded-full bg-background/50 px-5 text-[14px]"
        autoFocus
        suppressHydrationWarning
      />

      {/* Send Button */}
      <Button
        id="send-btn"
        onClick={handleSend}
        disabled={!value.trim()}
        className="h-11 shrink-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 px-5 font-semibold shadow-md shadow-indigo-500/25 transition-all hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 sm:px-6"
      >
        Send ✈
      </Button>
    </div>
  );
}
