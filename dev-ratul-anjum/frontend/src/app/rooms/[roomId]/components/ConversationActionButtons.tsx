"use client";
import blockUser from "@/actions/blockUser";
import deleteConversation from "@/actions/deleteConversation";
import reportUser from "@/actions/reportUser";
import unblockUser from "@/actions/unblockUser";
import ConfirmationModal from "@/components/ConfirmationModal";
import { useQueryClient } from "@tanstack/react-query";
import { Ban, ThumbsDown, Trash2 } from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const ConversationActionButtons = ({
  conversationId,
  participantName,
  participantId,
  data,
}: {
  conversationId: string;
  participantName: string;
  participantId: string;
  data: {
    isBlocked: boolean;
    blockedByMe: boolean;
  };
}) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState<boolean>(false);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    const res = await deleteConversation(conversationId);

    if (res?.success) {
      toast.success("Conversation deleted!", {
        className:
          "bg-[#00875F] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
      setIsDeleteModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["conversations"] });

      redirect(`/rooms`);
    } else {
      toast.error(res?.message, {
        className:
          "bg-[#C53030] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
      setIsDeleteModalOpen(false);
    }
  };

  const handleBlock = async () => {
    const res = await blockUser(participantId);

    if (res?.success) {
      toast.success("User successfully blocked.", {
        className:
          "bg-[#00875F] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
      setIsBlockModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["block-info"] });
    } else {
      toast.error(res?.message, {
        className:
          "bg-[#C53030] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
      setIsBlockModalOpen(false);
    }
  };

  const handleUnblock = async () => {
    const res = await unblockUser(participantId);

    if (res?.success) {
      toast.success("User unblocked successfully.", {
        className:
          "bg-[#00875F] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
      setIsUnblockModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["block-info"] });
    } else {
      toast.error(res?.message, {
        className:
          "bg-[#C53030] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
      setIsUnblockModalOpen(false);
    }
  };

  const handleReport = async () => {
    const res = await reportUser(participantId);

    if (res?.success) {
      toast.success("Report submitted successfully.", {
        className:
          "bg-[#00875F] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
      setIsReportModalOpen(false);
    } else {
      toast.error(res?.message, {
        className:
          "bg-[#C53030] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
      setIsReportModalOpen(false);
    }
  };
  return (
    <div className="mb-4 flex flex-col bg-white shadow-sm">
      {(!data?.isBlocked || !data?.blockedByMe) && (
        <button
          className="flex items-center gap-4 px-4 py-3 font-medium text-red-500 hover:bg-gray-50 cursor-pointer"
          onClick={() => setIsBlockModalOpen(true)}
        >
          <Ban className="h-5 w-5" />
          <span>Block {participantName}</span>
        </button>
      )}

      {data?.isBlocked && data?.blockedByMe && (
        <button
          className="flex items-center gap-4 px-4 py-3 font-medium text-red-500 hover:bg-gray-50 cursor-pointer"
          onClick={() => setIsUnblockModalOpen(true)}
        >
          <Ban className="h-5 w-5" />
          <span>Unblock {participantName}</span>
        </button>
      )}

      <button
        className="flex items-center gap-4 border-t border-[#e9edef] px-4 py-3 font-medium text-red-500 hover:bg-gray-50 cursor-pointer"
        onClick={() => setIsReportModalOpen(true)}
      >
        <ThumbsDown className="h-5 w-5" />
        <span>Report {participantName}</span>
      </button>

      <button
        onClick={() => setIsDeleteModalOpen(true)}
        className="flex items-center gap-4 border-t border-[#e9edef] px-4 py-3 font-medium text-red-500 hover:bg-gray-50 cursor-pointer"
      >
        <Trash2 className="h-5 w-5" />
        <span>Delete Chat</span>
      </button>

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete entire conversation?"
        description="Are you sure you want to delete this chat? This action cannot be undone and all message history will be permanently lost."
        cancelValue="Cancel"
        confirmValue="Yes, Delete Chat"
      />

      <ConfirmationModal
        isOpen={isBlockModalOpen}
        onClose={() => setIsBlockModalOpen(false)}
        onConfirm={handleBlock}
        title={`Are you sure you want to block ${participantName}?`}
        description={`Blocking will stop all messaging between you and ${participantName} until the block is removed.`}
        cancelValue="Cancel"
        confirmValue="Yes, Block"
      />

      <ConfirmationModal
        isOpen={isUnblockModalOpen}
        onClose={() => setIsUnblockModalOpen(false)}
        onConfirm={handleUnblock}
        title={`Are you sure you want to unblock ${participantName}?`}
        description={`Unblocking will allow ${participantName} to send you messages again.`}
        cancelValue="Cancel"
        confirmValue="Yes, Unblock"
      />

      <ConfirmationModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onConfirm={handleReport}
        title={`Report ${participantName}?`}
        description={`Reporting this user will notify our moderation team. This action cannot be undone. If the report violates our community guidelines, appropriate action will be taken.`}
        cancelValue="Cancel"
        confirmValue="Yes, Report"
      />
    </div>
  );
};

export default ConversationActionButtons;
