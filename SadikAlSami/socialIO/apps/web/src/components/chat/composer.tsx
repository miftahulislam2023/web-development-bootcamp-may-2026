"use client";

import { useRef, useCallback, useEffect } from "react";
import { SendHorizontal } from "lucide-react";

import { useSendMessage } from "@/hooks/use-send-message";
import { useChatStore } from "@/stores/chat-store";
import { useWS } from "@/components/providers/ws-provider";

/**
 * Message composer — auto-growing textarea, draft persistence,
 * debounced typing detection, and send on Enter.
 * Styled as a floating pill above the bottom edge — no harsh border.
 */
export function Composer({ conversationId }: { conversationId: string }) {
	const { send } = useWS();
	const sendMessage = useSendMessage();
	const draft = useChatStore((s) => s.drafts[conversationId] ?? "");
	const setDraft = useChatStore((s) => s.setDraft);

	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const isTypingRef = useRef(false);

	const content = draft;

	const autoResize = useCallback(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;
		textarea.style.height = "auto";
		const maxHeight = 5 * 24;
		textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
	}, []);

	const emitTypingStart = useCallback(() => {
		if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
		typingTimerRef.current = setTimeout(() => {
			if (!isTypingRef.current) {
				isTypingRef.current = true;
				send({ type: "typing_start", payload: { conversationId } });
			}
		}, 300);
	}, [conversationId, send]);

	const emitTypingStop = useCallback(() => {
		if (typingTimerRef.current) {
			clearTimeout(typingTimerRef.current);
			typingTimerRef.current = null;
		}
		if (isTypingRef.current) {
			isTypingRef.current = false;
			send({ type: "typing_stop", payload: { conversationId } });
		}
	}, [conversationId, send]);

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setDraft(conversationId, e.target.value);
			autoResize();
			if (e.target.value.trim()) {
				emitTypingStart();
			} else {
				emitTypingStop();
			}
		},
		[conversationId, setDraft, autoResize, emitTypingStart, emitTypingStop],
	);

	const handleSend = useCallback(() => {
		const trimmed = content.trim();
		if (!trimmed) return;

		sendMessage.mutate({ conversationId, content: trimmed });
		setDraft(conversationId, "");
		emitTypingStop();

		if (textareaRef.current) {
			textareaRef.current.style.height = "auto";
		}
		requestAnimationFrame(() => {
			textareaRef.current?.focus();
		});
	}, [content, conversationId, sendMessage, setDraft, emitTypingStop]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend],
	);

	const handleBlur = useCallback(() => emitTypingStop(), [emitTypingStop]);

	useEffect(() => {
		return () => {
			if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
		};
	}, []);

	useEffect(() => {
		autoResize();
	}, [conversationId, autoResize]);

	const canSend = !!content.trim() && !sendMessage.isPending;

	return (
		<div className="shrink-0 px-4 py-3 bg-background">
			{/* Pill container — subtle surface, no hard top border */}
			<div className="flex items-end gap-2 rounded-2xl bg-muted/70 px-4 py-2.5 ring-1 ring-border/50 transition-shadow duration-150 focus-within:ring-primary/40 focus-within:ring-2">
				<textarea
					ref={textareaRef}
					id="message-composer"
					value={content}
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					onBlur={handleBlur}
					placeholder="Type a message…"
					rows={1}
					className="flex-1 resize-none bg-transparent py-0.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none leading-relaxed"
				/>

				<button
					onClick={handleSend}
					disabled={!canSend}
					aria-label="Send message"
					className="mb-0.5 flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all duration-150 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
				>
					<SendHorizontal className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
