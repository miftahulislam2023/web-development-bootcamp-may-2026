"use client";

import { MessageSquare } from "lucide-react";
import { motion } from "motion/react";

import { useChatStore } from "@/stores/chat-store";
import { ConversationSidebar } from "@/components/chat/conversation-sidebar";
import { MessageThread } from "@/components/chat/message-thread";
import { Composer } from "@/components/chat/composer";
import { ConnectionBanner } from "@/components/chat/connection-banner";

/**
 * Main chat page — composes sidebar, thread, and composer.
 * Desktop: 3-column layout (sidebar | thread+composer).
 * Mobile: shows sidebar OR thread, toggled by activeConversationId.
 */
export default function ChatPage() {
	const activeConversationId = useChatStore((s) => s.activeConversationId);

	return (
		<div className="flex h-full w-full bg-background">
			{/* Sidebar — always visible on desktop, hidden on mobile when viewing a conversation */}
			<div
				className={`${
					activeConversationId ? "hidden lg:flex" : "flex"
				} w-full lg:w-[320px] shrink-0 flex-col border-r border-border`}
			>
				<ConversationSidebar />
			</div>

			{/* Thread area — hidden on mobile when no conversation selected */}
			<div
				className={`${
					activeConversationId ? "flex" : "hidden lg:flex"
				} flex-1 flex-col min-w-0`}
			>
				<ConnectionBanner />

				{activeConversationId ? (
					<>
						<MessageThread conversationId={activeConversationId} />
						<Composer conversationId={activeConversationId} />
					</>
				) : (
					<EmptyState />
				)}
			</div>
		</div>
	);
}

/**
 * Empty state shown when no conversation is selected.
 */
function EmptyState() {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.3 }}
			className="flex flex-1 flex-col items-center justify-center gap-4 p-8 bg-background"
		>
			<div className="flex size-20 items-center justify-center rounded-full bg-primary/10">
				<MessageSquare className="size-10 text-primary" />
			</div>
			<div className="text-center">
				<h2 className="text-xl font-semibold text-foreground">
					Select a conversation
				</h2>
				<p className="mt-1 text-sm text-muted-foreground">
					Pick a chat from the sidebar or start a new one
				</p>
			</div>
		</motion.div>
	);
}
