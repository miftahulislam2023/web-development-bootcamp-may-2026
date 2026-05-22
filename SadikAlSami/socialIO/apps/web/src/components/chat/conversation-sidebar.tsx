"use client";

import { useState, useMemo } from "react";
import { Search, MessageSquarePlus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Skeleton } from "@socialIO/ui/components/skeleton";
import { Input } from "@socialIO/ui/components/input";
import { Avatar, AvatarFallback, AvatarImage } from "@socialIO/ui/components/avatar";
import { Badge } from "@socialIO/ui/components/badge";

import { useChatStore } from "@/stores/chat-store";
import { useConversations } from "@/hooks/use-conversations";
import { useUnreadCounts } from "@/hooks/use-unread-counts";
import { useAuthStore } from "@/stores/auth-store";
import { NewChatFab } from "./new-chat-fab";
import type { ConversationListItem } from "@/types/api";

function formatRelativeTime(dateStr: string): string {
	const now = Date.now();
	const then = new Date(dateStr).getTime();
	const diffMs = now - then;
	const diffSec = Math.floor(diffMs / 1_000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHr = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHr / 24);

	if (diffSec < 60) return "now";
	if (diffMin < 60) return `${diffMin}m`;
	if (diffHr < 24) return `${diffHr}h`;
	if (diffDay === 1) return "Yesterday";
	if (diffDay < 7) return `${diffDay}d`;

	return new Date(dateStr).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
	});
}

function getInitials(name: string): string {
	if (!name) return "?";
	return name
		.split(" ")
		.slice(0, 2)
		.map((w) => w[0])
		.join("")
		.toUpperCase();
}

/**
 * Conversation sidebar — lists all conversations with last message preview,
 * timestamps, and unread badges. Supports search filtering and layout animations.
 */
export function ConversationSidebar() {
	const [searchFilter, setSearchFilter] = useState("");
	const activeConversationId = useChatStore((s) => s.activeConversationId);
	const setActiveConversation = useChatStore((s) => s.setActiveConversation);
	const currentUserId = useAuthStore((s) => s.session?.user?.id);

	const { data: conversations, isLoading } = useConversations();
	const { data: unreadCounts } = useUnreadCounts();

	const filtered = useMemo(() => {
		if (!conversations) return [];
		if (!searchFilter.trim()) return conversations;
		const q = searchFilter.toLowerCase();
		return conversations.filter((c) => {
			const name = getConversationName(c, currentUserId);
			return name.toLowerCase().includes(q);
		});
	}, [conversations, searchFilter, currentUserId]);

	return (
		<div className="flex h-full flex-col bg-background">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-border px-4 py-3.5">
				<h1 className="text-base font-semibold tracking-tight text-foreground">
					Messages
				</h1>
			</div>

			{/* Search */}
			<div className="px-3 py-2">
				<div className="relative">
					<Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
					<Input
						id="sidebar-search"
						type="text"
						placeholder="Search conversations..."
						value={searchFilter}
						onChange={(e) => setSearchFilter(e.target.value)}
						className="pl-8.5 h-9 border-border bg-muted/50 text-sm placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:bg-card"
					/>
				</div>
			</div>

			{/* List */}
			<div className="flex-1 overflow-y-auto">
				{isLoading ? (
					<SidebarSkeleton />
				) : filtered.length === 0 ? (
					<EmptySidebar hasConversations={!!conversations?.length} />
				) : (
					<AnimatePresence mode="popLayout">
						{filtered.map((conv) => (
							<ConversationItem
								key={conv.id}
								conversation={conv}
								isActive={conv.id === activeConversationId}
								unreadCount={unreadCounts?.[conv.id] ?? conv.unreadCount}
								currentUserId={currentUserId}
								onSelect={() => setActiveConversation(conv.id)}
							/>
						))}
					</AnimatePresence>
				)}
			</div>

			{/* FAB */}
			<NewChatFab />
		</div>
	);
}

function getConversationName(
	conv: ConversationListItem,
	currentUserId: string | undefined,
): string {
	if (conv.type === "group" && conv.name) return conv.name;
	const other = conv.participants.find((p) => p.userId !== currentUserId);
	if (other?.displayName) return other.displayName;
	return conv.name ?? "Conversation";
}

function getConversationAvatar(
	conv: ConversationListItem,
	currentUserId: string | undefined,
): string | null {
	if (conv.avatarUrl) return conv.avatarUrl;
	if (conv.type === "dm") {
		const other = conv.participants.find((p) => p.userId !== currentUserId);
		return other?.avatarUrl ?? null;
	}
	return null;
}

function getLastMessagePreview(conv: ConversationListItem): string {
	if (!conv.lastMessage) return "No messages yet";
	if (conv.lastMessage.isDeleted) return "Message deleted";
	if (conv.lastMessage.type === "image") return "Sent a photo";
	return conv.lastMessage.content ?? "";
}

function ConversationItem({
	conversation,
	isActive,
	unreadCount,
	currentUserId,
	onSelect,
}: {
	conversation: ConversationListItem;
	isActive: boolean;
	unreadCount: number;
	currentUserId: string | undefined;
	onSelect: () => void;
}) {
	const displayName = getConversationName(conversation, currentUserId);
	const avatarUrl = getConversationAvatar(conversation, currentUserId);
	const preview = getLastMessagePreview(conversation);
	const timestamp = conversation.lastMessage
		? formatRelativeTime(conversation.lastMessage.createdAt)
		: formatRelativeTime(conversation.createdAt);

	const isOwnLastMessage = conversation.lastMessage?.senderId === currentUserId;
	const senderPrefix = conversation.lastMessage
		? isOwnLastMessage
			? "You"
			: (conversation.lastMessage.senderName?.split(" ")[0] ?? null)
		: null;

	return (
		<motion.button
			layout
			layoutId={`conv-${conversation.id}`}
			initial={{ opacity: 0, y: 4 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -4 }}
			transition={{ type: "spring", stiffness: 400, damping: 30 }}
			onClick={onSelect}
			className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-150 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
				isActive ? "bg-primary/8 dark:bg-primary/10" : ""
			}`}
		>
			<Avatar className="size-11 shrink-0">
				<AvatarImage src={avatarUrl ?? undefined} alt={displayName} />
				<AvatarFallback className="bg-primary/12 text-primary text-xs font-semibold">
					{getInitials(displayName)}
				</AvatarFallback>
			</Avatar>

			<div className="flex min-w-0 flex-1 flex-col gap-0.5">
				{/* Name + timestamp row */}
				<div className="flex items-center justify-between gap-2">
					<span className="truncate text-sm font-semibold text-foreground">
						{displayName}
					</span>
					<span className="shrink-0 text-[11px] text-muted-foreground">
						{timestamp}
					</span>
				</div>

				{/* Preview + unread badge row */}
				<div className="flex items-center justify-between gap-2">
					{/* min-w-0 ensures this flex child can shrink and truncate properly */}
					<div className="flex min-w-0 items-baseline gap-1">
						{senderPrefix && (
							<span className="shrink-0 text-xs font-medium text-muted-foreground">
								{senderPrefix}:
							</span>
						)}
						<span className="truncate text-xs text-muted-foreground">
							{preview}
						</span>
					</div>
					{unreadCount > 0 && (
						<Badge className="h-5 min-w-5 shrink-0 rounded-full bg-destructive px-1.5 text-[10px] font-bold text-white hover:bg-destructive">
							{unreadCount > 99 ? "99+" : unreadCount}
						</Badge>
					)}
				</div>
			</div>
		</motion.button>
	);
}

function SidebarSkeleton() {
	return (
		<div className="space-y-1 p-2">
			{Array.from({ length: 6 }).map((_, i) => (
				<div key={i} className="flex items-center gap-3 px-2 py-3">
					<Skeleton className="size-11 rounded-full" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-3.5 w-3/4 rounded" />
						<Skeleton className="h-3 w-1/2 rounded" />
					</div>
				</div>
			))}
		</div>
	);
}

function EmptySidebar({ hasConversations }: { hasConversations: boolean }) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
			<div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
				<MessageSquarePlus className="size-8 text-primary" />
			</div>
			<p className="text-sm font-medium text-foreground">
				{hasConversations ? "No matches found" : "It's quiet here"}
			</p>
			<p className="text-xs text-muted-foreground">
				{hasConversations
					? "Try a different search term"
					: "Start a debate? Hit the + button below"}
			</p>
		</div>
	);
}
