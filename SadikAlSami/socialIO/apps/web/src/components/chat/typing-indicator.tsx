"use client";

import { AnimatePresence, motion } from "motion/react";

/**
 * Typing indicator — shows "X is typing..." with animated bouncing dots.
 * Reads typing user IDs and displays below the message thread.
 */
export function TypingIndicator({
	conversationId,
	typingUserIds,
}: {
	conversationId: string;
	typingUserIds: string[];
}) {
	if (typingUserIds.length === 0) return null;

	const label =
		typingUserIds.length === 1
			? "Someone is typing"
			: `${typingUserIds.length} people are typing`;

	return (
		<AnimatePresence>
			<motion.div
				key={`typing-${conversationId}`}
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				exit={{ opacity: 0, y: 6 }}
				transition={{ duration: 0.2 }}
				className="flex items-center gap-2 px-1 py-2"
			>
				{/* Animated dots */}
				<div className="flex items-center gap-0.5 rounded-full bg-muted px-3 py-2">
					{[0, 1, 2].map((i) => (
						<motion.span
							key={i}
							className="inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground"
							animate={{ y: [0, -4, 0] }}
							transition={{
								duration: 0.6,
								repeat: Infinity,
								delay: i * 0.15,
								ease: "easeInOut",
							}}
						/>
					))}
				</div>
				<span className="text-xs text-muted-foreground">
					{label}
				</span>
			</motion.div>
		</AnimatePresence>
	);
}
