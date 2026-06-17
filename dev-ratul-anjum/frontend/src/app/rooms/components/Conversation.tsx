import { FileText, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type RowComponentProps } from "react-window";

const Conversation = ({
  index,
  style,
  items,
  selectedChatId,
  setSelectedChatId,
}: RowComponentProps<ConversationRowData>) => {
  const item = items[index];
  if (!item) return null;
  const isSelected = item.id === selectedChatId;
  return (
    <Link
      href={`/rooms/${item.id}`}
      style={style}
      onClick={() => setSelectedChatId(item.id)}
      className={`flex cursor-pointer items-center gap-3 border-b border-[#e9edef]/50 px-3 py-3 hover:bg-[#f0f2f5] transition ${isSelected && "bg-[#f0f2f5] group relative"}`}
    >
      {item.participantPhoto ? (
        <Image
          src={item.participantPhoto}
          alt="User"
          width={48}
          height={48}
          className="rounded-full w-12 h-12 object-cover"
        />
      ) : (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-white">
          <UserIcon className="h-6 w-6" />
        </div>
      )}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between">
          <h3 className="truncate text-base font-medium text-[#111b21]">
            {item.participantName}
          </h3>
          <span className="text-xs text-[#667781]">{item.lastMessageAt}</span>
        </div>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-1 truncate text-sm text-[#667781]">
            {item.attachments && <FileText className="h-4 w-4 text-red-500" />}
            <span>{item.lastMessage && item.lastMessage}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Conversation;

type ConversationRowData = {
  items: ConversationItem[];
  selectedChatId: string | null;
  setSelectedChatId: (id: string) => void;
};

type ConversationItem = {
  id: string;
  participantName: string;
  participantPhoto?: string | null;
  lastMessage?: string | null;
  lastMessageAt?: string | null;
  attachments?: boolean;
};
