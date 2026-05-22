"use client";

import { useState, useCallback } from "react";
import { Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@socialIO/ui/components/dialog";
import { Input } from "@socialIO/ui/components/input";
import { Avatar, AvatarFallback, AvatarImage } from "@socialIO/ui/components/avatar";

import { useSearchUsers } from "@/hooks/use-search-users";
import { useCreateConversation } from "@/hooks/use-create-conversation";
import { useChatStore } from "@/stores/chat-store";
import type { SearchResult } from "@/types/api";

/**
 * Modal dialog for searching users and starting a new DM conversation.
 * Uses debounced search input and displays matching user profiles.
 */
export function UserSearchModal({
	open,
	onOpenChange,
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const [searchQuery, setSearchQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");
	const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

	const { data: results, isLoading: isSearching } = useSearchUsers(debouncedQuery);
	const createConversation = useCreateConversation();
	const setActiveConversation = useChatStore((s) => s.setActiveConversation);

	const handleSearchChange = useCallback(
		(value: string) => {
			setSearchQuery(value);

			if (debounceTimer) clearTimeout(debounceTimer);

			const timer = setTimeout(() => {
				setDebouncedQuery(value);
			}, 300);
			setDebounceTimer(timer);
		},
		[debounceTimer],
	);

	const handleSelectUser = useCallback(
		async (user: SearchResult) => {
			try {
				const res = await createConversation.mutateAsync({
					type: "dm",
					participantId: user.id,
				});

				const newConvId = res.data?.conversation?.id as string | undefined;
				if (newConvId) {
					setActiveConversation(newConvId);
				}

				onOpenChange(false);
				setSearchQuery("");
				setDebouncedQuery("");
			} catch {
				toast.error("Failed to start conversation. Please try again.");
			}
		},
		[createConversation, setActiveConversation, onOpenChange],
	);

	const handleOpenChange = useCallback(
		(isOpen: boolean) => {
			onOpenChange(isOpen);
			if (!isOpen) {
				setSearchQuery("");
				setDebouncedQuery("");
			}
		},
		[onOpenChange],
	);

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-foreground">
						New Conversation
					</DialogTitle>
					<DialogDescription>
						Search for a user to start a conversation with.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-4">
					{/* Search input */}
					<div className="relative">
						<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							id="user-search-input"
							type="text"
							placeholder="Search by name..."
							value={searchQuery}
							onChange={(e) => handleSearchChange(e.target.value)}
							className="pl-9 border-border focus-visible:ring-primary"
							autoFocus
						/>
					</div>

					{/* Results */}
					<div className="max-h-64 overflow-y-auto">
						{isSearching && debouncedQuery.length >= 2 ? (
							<div className="flex items-center justify-center py-8">
								<Loader2 className="h-5 w-5 animate-spin text-primary" />
							</div>
						) : results && results.length > 0 ? (
							<div className="space-y-1">
								{results.map((user) => (
									<button
										key={user.id}
										onClick={() => handleSelectUser(user)}
										disabled={createConversation.isPending}
										className="flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-200 hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
									>
										<Avatar className="h-9 w-9">
											<AvatarImage src={user.avatarUrl ?? undefined} alt={user.displayName} />
											<AvatarFallback className="bg-secondary/15 text-secondary text-xs font-semibold">
												{user.displayName.substring(0, 2).toUpperCase()}
											</AvatarFallback>
										</Avatar>
										<span className="text-sm font-semibold text-foreground">
											{user.displayName}
										</span>
									</button>
								))}
							</div>
						) : debouncedQuery.length >= 2 ? (
							<p className="py-8 text-center text-sm text-muted-foreground">
								No users found for &ldquo;{debouncedQuery}&rdquo;
							</p>
						) : (
							<p className="py-8 text-center text-sm text-muted-foreground">
								Type at least 2 characters to search
							</p>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
