"use client";

import { useRef, useEffect, useCallback } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";

import { Avatar, AvatarFallback, AvatarImage } from "@socialIO/ui/components/avatar";
import { Skeleton } from "@socialIO/ui/components/skeleton";

import { useMessages } from "@/hooks/use-messages";
import { useConversationDetail } from "@/hooks/use-conversation-detail";
import { useAuthStore } from "@/stores/auth-store";
import { useChatStore } from "@/stores/chat-store";
import { useWS } from "@/components/providers/ws-provider";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";

const EMPTY_ARRAY: string[] = [];

/**
 * Message thread — displays messages for the active conversation.
 * Supports infinite scroll upward and auto-scroll to bottom on new messages.
 */
export function MessageThread({ conversationId }: { conversationId: string }) {
	const currentUserId = useAuthStore((s) => s.session?.user?.id);
	const setActiveConversation = useChatStore((s) => s.setActiveConversation);
	const typingUsers = useChatStore((s) => s.typingUsers[conversationId] ?? EMPTY_ARRAY);

	const { data: detail } = useConversationDetail(conversationId);
	const {
		data: messageData,
		isLoading,
		hasNextPage,
		isFetchingNextPage,
		fetchNextPage,
	} = useMessages(conversationId);
	const { send } = useWS();

	const scrollContainerRef = useRef<HTMLDivElement>(null);
	const sentinelRef = useRef<HTMLDivElement>(null);
	const isAtBottomRef = useRef(true);
	const prevPageCountRef = useRef(0);

	// Flatten all pages into a single array, reversed (oldest first for display)
	const allMessages = messageData?.pages?.flatMap((p) => p.messages) ?? [];
	// The API returns newest first, so we reverse to show oldest-at-top
	const displayMessages = [...allMessages].reverse();

	/**
	 * Tracks whether user is scrolled to bottom.
	 */
	const handleScroll = useCallback(() => {
		const el = scrollContainerRef.current;
		if (!el) return;
		const threshold = 80;
		isAtBottomRef.current =
			el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
	}, []);

	/**
	 * Auto-scroll to bottom when new messages arrive (if already at bottom).
	 */
	useEffect(() => {
		const el = scrollContainerRef.current;
		if (!el) return;

		const currentPageCount = messageData?.pages?.length ?? 0;

		// Only auto-scroll for new messages on first page, not pagination loads
		if (currentPageCount === prevPageCountRef.current && isAtBottomRef.current) {
			el.scrollTop = el.scrollHeight;
		}

		prevPageCountRef.current = currentPageCount;
	}, [allMessages.length, messageData?.pages?.length]);

	/**
	 * Emit message_seen for the latest message sent by someone else.
	 * Fires on mount, conversation change, and when new messages arrive.
	 * This drives the real-time seen tick on the sender's side.
	 */
	useEffect(() => {
		if (!currentUserId || allMessages.length === 0) return;
		// Find the most recent message not sent by the current user
		const latestReceived = allMessages.find(
			(m) => m.senderId !== currentUserId && !m.id.startsWith('temp-'),
		);
		if (latestReceived) {
			send({
				type: 'message_seen',
				payload: { conversationId, messageId: latestReceived.id },
			});
		}
	}, [conversationId, allMessages.length, currentUserId, send]);

	/**
	 * Initial scroll to bottom on mount.
	 */
	useEffect(() => {
		const el = scrollContainerRef.current;
		if (el && !isLoading) {
			el.scrollTop = el.scrollHeight;
		}
	}, [isLoading, conversationId]);

	/**
	 * Intersection Observer for infinite scroll upward.
	 */
	useEffect(() => {
		const sentinel = sentinelRef.current;
		if (!sentinel || !hasNextPage) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0]?.isIntersecting && hasNextPage && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{ threshold: 0.1 },
		);

		observer.observe(sentinel);
		return () => observer.disconnect();
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	// Resolve display name for the conversation header
	const headerName = getHeaderName(detail, currentUserId);
	const headerAvatar = detail?.avatarUrl ?? null;

	// Filter out current user from typing users
	const otherTypingUsers = typingUsers.filter((id) => id !== currentUserId);

	return (
		<div className="flex flex-1 flex-col min-h-0 bg-background">
			{/* Conversation header */}
			<div className="flex items-center gap-3 border-b border-border bg-background px-4 py-3 shrink-0">
				{/* Mobile back button */}
				<button
					onClick={() => setActiveConversation(null)}
					className="cursor-pointer lg:hidden p-1 -ml-1 rounded-lg transition-colors duration-200 hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
					aria-label="Back to conversations"
				>
					<ArrowLeft className="h-5 w-5 text-foreground" />
				</button>

				<Avatar className="h-9 w-9">
					<AvatarImage src={headerAvatar ?? undefined} alt={headerName} />
					<AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
						{headerName.substring(0, 2).toUpperCase()}
					</AvatarFallback>
				</Avatar>

				<div className="flex flex-col min-w-0">
					<span className="truncate text-sm font-semibold text-foreground">
						{headerName}
					</span>
					{detail?.type === "group" && detail.participants && (
						<span className="truncate text-xs text-muted-foreground">
							{detail.participants.length} members
						</span>
					)}
				</div>
			</div>

			{/* Messages area */}
			<div
				ref={scrollContainerRef}
				onScroll={handleScroll}
				className="flex-1 overflow-y-auto px-4 py-3"
			>
				{isLoading ? (
					<MessagesSkeleton />
				) : displayMessages.length === 0 ? (
					<EmptyThread />
				) : (
					<>
						{/* Sentinel for infinite scroll upward */}
						<div ref={sentinelRef} className="h-1" />

						{isFetchingNextPage && (
							<div className="flex items-center justify-center py-3">
								<Loader2 className="h-4 w-4 animate-spin text-primary" />
							</div>
						)}

						<div className="space-y-1">
							{displayMessages.map((msg) => (
								<MessageBubble
									key={msg.id}
									message={msg}
									isOwn={msg.senderId === currentUserId || msg.senderId === "me"}
									showSenderName={detail?.type === "group"}
								/>
							))}
						</div>
					</>
				)}

				{/* Typing indicator */}
				{otherTypingUsers.length > 0 && (
					<TypingIndicator
						conversationId={conversationId}
						typingUserIds={otherTypingUsers}
					/>
				)}
			</div>
		</div>
	);
}

function getHeaderName(
	detail: ReturnType<typeof useConversationDetail>["data"],
	currentUserId: string | undefined,
): string {
	if (!detail) return "Loading...";
	if (detail.type === "group" && detail.name) return detail.name;

	// For DMs, find the other participant
	if (detail.participants) {
		const other = detail.participants.find((p) => p.userId !== currentUserId);
		if (other?.displayName) return other.displayName;
	}

	return detail.name ?? "Conversation";
}

function MessagesSkeleton() {
	return (
		<div className="space-y-4 py-4">
			{/* Received */}
			<div className="flex items-end gap-2 max-w-[75%]">
				<Skeleton className="size-8 rounded-full shrink-0" />
				<Skeleton className="h-12 w-48 rounded-2xl rounded-bl-sm" />
			</div>
			{/* Sent */}
			<div className="flex items-end justify-end gap-2 max-w-[75%] ml-auto">
				<Skeleton className="h-10 w-40 rounded-2xl rounded-br-sm" />
			</div>
			{/* Received */}
			<div className="flex items-end gap-2 max-w-[75%]">
				<Skeleton className="size-8 rounded-full shrink-0" />
				<Skeleton className="h-16 w-56 rounded-2xl rounded-bl-sm" />
			</div>
			{/* Sent */}
			<div className="flex items-end justify-end gap-2 max-w-[75%] ml-auto">
				<Skeleton className="h-8 w-32 rounded-2xl rounded-br-sm" />
			</div>
		</div>
	);
}

function EmptyThread() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ delay: 0.2 }}
			className="flex flex-1 flex-col items-center justify-center gap-2 py-16 text-center"
		>
			<p className="text-sm font-semibold text-foreground">
				No messages yet
			</p>
			<p className="text-xs text-muted-foreground">
				Send a message to start the conversation
			</p>
		</motion.div>
	);
}
