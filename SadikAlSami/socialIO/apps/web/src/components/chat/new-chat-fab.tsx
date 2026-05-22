"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { motion } from "motion/react";

import { UserSearchModal } from "./user-search-modal";

/**
 * @description
 * Floating action button positioned at the bottom-right of the sidebar.
 * Opens the UserSearchModal to start a new conversation.
 */
export function NewChatFab() {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<>
			<div className="relative px-4 py-3">
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setIsModalOpen(true)}
					className="ml-auto flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-[#E07A5F] text-white shadow-lg transition-colors duration-200 hover:bg-[#c96c53] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E07A5F] focus-visible:ring-offset-2 focus-visible:ring-offset-[#F9F9F8] dark:focus-visible:ring-offset-[#1C1C1E]"
					aria-label="New conversation"
				>
					<Plus className="h-5 w-5" />
				</motion.button>
			</div>

			<UserSearchModal open={isModalOpen} onOpenChange={setIsModalOpen} />
		</>
	);
}
