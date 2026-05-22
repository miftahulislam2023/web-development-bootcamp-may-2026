"use client";

import { Check, CheckCheck, AlertCircle } from "lucide-react";
import { motion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@socialIO/ui/components/avatar";

import type { MessageResponse } from "@/types/api";

/**
 * Individual message bubble with sender info, status ticks, and entrance animation.
 * Sent messages: right-aligned, primary color.
 * Received messages: left-aligned, card surface with border.
 */
export function MessageBubble({
	message,
	isOwn,
	showSenderName,
}: {
	message: MessageResponse;
	isOwn: boolean;
	showSenderName: boolean;
}) {
	const isOptimistic = message.id.startsWith("temp-");
	const isFailed = false;

	if (message.isDeleted) {
		return (
			<div className={`flex ${isOwn ? "justify-end" : "justify-start"} py-1`}>
				<div className="rounded-2xl bg-muted px-4 py-2">
					<p className="text-xs italic text-muted-foreground">
						This message was deleted
					</p>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10, scale: 0.95 }}
			animate={{ opacity: 1, y: 0, scale: 1 }}
			transition={{ type: "spring", stiffness: 400, damping: 25 }}
			className={`flex ${isOwn ? "justify-end" : "justify-start"} py-0.5`}
		>
			<div
				className={`flex max-w-[75%] items-end gap-2 ${
					isOwn ? "flex-row-reverse" : "flex-row"
				}`}
			>
				{/* Avatar — received messages only */}
				{!isOwn && (
					<Avatar className="mb-5 size-7 shrink-0">
						<AvatarImage src={undefined} alt={message.senderDisplayName ?? "User"} />
						<AvatarFallback className="bg-secondary/15 text-secondary text-[10px] font-semibold">
							{(message.senderDisplayName ?? "U").substring(0, 2).toUpperCase()}
						</AvatarFallback>
					</Avatar>
				)}

				<div className={`flex flex-col ${isOwn ? "items-end" : "items-start"}`}>
					{/* Sender name — group chats, received only */}
					{!isOwn && showSenderName && message.senderDisplayName && (
						<span className="mb-0.5 ml-1 text-[10px] font-semibold text-muted-foreground">
							{message.senderDisplayName}
						</span>
					)}

					{/* Bubble */}
					<div
						className={`rounded-2xl px-3.5 py-2 ${
							isOwn
								? "rounded-br-sm bg-primary text-primary-foreground"
								: "rounded-bl-sm bg-card text-foreground ring-1 ring-border"
						} ${isOptimistic ? "opacity-70" : ""}`}
					>
						{message.type === "image" && message.imageUrl ? (
							<img
								src={message.imageUrl}
								alt="Shared image"
								className="max-w-[240px] rounded-lg"
							/>
						) : (
							<p className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-word">
								{message.content}
							</p>
						)}
					</div>

					{/* Meta row: timestamp, edited, status */}
					<div
						className={`mt-0.5 flex items-center gap-1 px-1 ${
							isOwn ? "flex-row-reverse" : "flex-row"
						}`}
					>
						<span className="text-[10px] text-muted-foreground">
							{formatTime(message.createdAt)}
						</span>

						{message.isEdited && (
							<span className="text-[10px] italic text-muted-foreground">
								edited
							</span>
						)}

						{/* Status ticks — own confirmed messages only */}
						{isOwn && !isOptimistic && !isFailed && (
							<StatusTick message={message} />
						)}

						{/* Optimistic: faded tick while in-flight */}
						{isOwn && isOptimistic && (
							<Check className="h-3.5 w-3.5 text-primary-foreground/50" />
						)}

						{isFailed && (
							<AlertCircle className="h-3.5 w-3.5 text-destructive" />
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}

function formatTime(dateStr: string): string {
	const d = new Date(dateStr);
	const h = d.getHours();
	const m = d.getMinutes().toString().padStart(2, "0");
	const ampm = h >= 12 ? "PM" : "AM";
	const h12 = h % 12 || 12;
	return `${h12}:${m} ${ampm}`;
}

/**
 * Live status tick indicator for own confirmed messages.
 * - Single gray check   → sent (no status data yet)
 * - Double gray check   → delivered to at least one participant
 * - Double green check  → seen by at least one participant (secondary = sage)
 */
function StatusTick({ message }: { message: MessageResponse }) {
	if (message.seenCount > 0) {
		return <CheckCheck className="h-3.5 w-3.5 text-secondary" />;
	}
	if (message.deliveredCount > 0) {
		return <CheckCheck className="h-3.5 w-3.5 text-muted-foreground" />;
	}
	return <Check className="h-3.5 w-3.5 text-muted-foreground" />;
}
