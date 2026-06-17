import { MessageCircle, UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { RowComponentProps } from "react-window";

const UserRow = ({
  index,
  style,
  items,
  selectedUserId,
  setSelectedUserId,
  setQuery,
}: RowComponentProps<UserRowData>) => {
  const item = items[index];
  if (!item) return null;
  const isSelected = item.id === selectedUserId;
  return (
    <div
      style={style}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer border-b border-[#e9edef]/50 ${isSelected && "bg-[#e9edef]"} ${!isSelected && "hover:bg-[#f5f6f6]"} ${item.hasConversation && "group"}`}
      onClick={() => {
        if (!item.hasConversation) {
          setSelectedUserId(item.id);
          setQuery(item.name);
        }
      }}
    >
      {item.image ? (
        <Image
          src={item.image}
          alt="User"
          className="rounded-full w-10 h-10 object-cover"
          width={40}
          height={40}
        />
      ) : (
        <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
          <UserIcon className="h-6 w-6" />
        </div>
      )}

      <div
        className={`flex-1 min-w-0 ${item.hasConversation && "flex justify-between items-center"}`}
      >
        <div className="flex flex-col">
          <span
            className={`text-base text-[#111b21] ${isSelected && "font-medium"}`}
          >
            {item.name}
          </span>
          <span className="text-xs text-[#667781]">
            {item.hasConversation
              ? "~Existing Chat"
              : isSelected
                ? "~Selected"
                : "Available"}
          </span>
        </div>
        {/* UI Behavior: Existing chat -> View Chat button */}
        {item.hasConversation && (
          <Link
            href={`/rooms/${item.conversationId}`}
            prefetch={false}
            className="flex items-center gap-1 rounded-full bg-[#e9edef] px-3 py-1 text-xs font-medium text-[#008069] hover:bg-[#d1d7db]"
          >
            <MessageCircle className="h-3 w-3" />
            View Chat
          </Link>
        )}
      </div>
    </div>
  );
};

export default UserRow;

type UserRowData = {
  items: UserItem[];
  selectedUserId: string | null;
  setSelectedUserId: (id: string) => void;
  setQuery: (id: string) => void;
};

type UserItem = {
  name: string;
  image: string | null;
  id: string;
  hasConversation: boolean;
  conversationId: string | null;
};
