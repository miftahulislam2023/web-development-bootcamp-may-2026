"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { EllipsisVertical, Search, SquarePen } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { List } from "react-window";
import ChatRowSkeleton from "../../../components/ChatRowSkeleton";
import FiltersSkeleton from "./FiltersSkeleton";
import useDebounce from "@/hooks/useDebounce";
import NoConversationSkeleton from "./NoConversationSkeleton";
import Conversation from "./Conversation";
import { useParams } from "next/navigation";

const ChatList = () => {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [query, setQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const params = useParams<{ roomId?: string }>();
  const isRoomPage = !!params?.roomId; // true if /rooms/[id]

  const debouncedSearchChange = useDebounce((value: string) => {
    setDebouncedSearch(value);
  }, 400);

  const {
    data,
    isLoading,
    fetchNextPage,
    fetchPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    hasNextPage,
    hasPreviousPage,
  } = useInfiniteQuery({
    queryKey: ["conversations", debouncedSearch],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/conversation/v1/all?page=${pageParam}&query=${debouncedSearch}`,
        {
          credentials: "include",
        },
      );
      return res.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.meta.hasNextPage) return undefined;
      return lastPage?.data?.meta.nextPage;
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage?.data?.meta.hasPrevPage) return undefined;
      return firstPage?.data?.meta.prevPage;
    },
    gcTime: 5 * 60_000,
  });

  const items = data?.pages.flatMap((page) => page.data.conversations) || [];
  const totalRow = items.length;

  const onRowsRender = ({
    startIndex,
    stopIndex,
  }: {
    startIndex: number;
    stopIndex: number;
  }) => {
    if (stopIndex + 10 >= items.length && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
    if (startIndex <= 10 && hasPreviousPage && !isFetchingPreviousPage) {
      fetchPreviousPage();
    }
  };

  return (
    <aside
      id="chat-list-panel"
      className={`absolute z-10 flex shrink-0 h-full w-full flex-col border-r border-[#e9edef] bg-white transition-transform duration-300 md:relative md:w-87.5 lg:w-100 ${isRoomPage ? "hidden md:flex" : "flex"}`}
    >
      {/* Header */}
      <header className="flex h-15 items-center justify-between bg-white px-4 py-2">
        <h1 className="text-2xl font-bold tracking-tight">Chats</h1>
        <div className="flex gap-3 text-[#54656f]">
          <button>
            <Link href="/add-chat">
              <SquarePen className="h-5 w-5" />
            </Link>
          </button>
          {/* <button>
            <EllipsisVertical className="h-5 w-5" />
          </button> */}
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-3 pb-2">
        <div className="flex h-9 items-center rounded-lg bg-[#f0f2f5] px-3">
          <Search className="h-5 w-5 cursor-pointer text-[#54656f]" />
          <input
            type="text"
            placeholder="Search by name or email address"
            value={query}
            onChange={(e) => {
              const text = e.target.value;
              setQuery(text);
              debouncedSearchChange(text);
            }}
            className="ml-4 w-full border-none bg-transparent text-sm outline-none placeholder-[#667781]"
          />
        </div>
      </div>

      {/* Filters */}
      {isLoading ? (
        <FiltersSkeleton />
      ) : (
        <div className="scrollbar-hide flex gap-2 overflow-x-auto px-3 py-2">
          <button className="whitespace-nowrap rounded-full bg-[#00a884]/10 px-3 py-1 text-xs font-medium text-[#00a884]">
            All
          </button>
          {/* <button className="whitespace-nowrap rounded-full bg-[#f0f2f5] px-3 py-1 text-xs font-medium text-[#667781] hover:bg-gray-200">
            Unread
          </button>
          <button className="whitespace-nowrap rounded-full bg-[#f0f2f5] px-3 py-1 text-xs font-medium text-[#667781] hover:bg-gray-200">
            Favourites
          </button>
          <button className="whitespace-nowrap rounded-full bg-[#f0f2f5] px-3 py-1 text-xs font-medium text-[#667781] hover:bg-gray-200">
            Groups
          </button> */}
        </div>
      )}

      {/* Chat List Items */}
      <div className="flex-1 h-0">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ChatRowSkeleton key={i} />)
        ) : (
          <>
            <List
              rowComponent={Conversation}
              rowCount={totalRow}
              rowHeight={73}
              rowProps={{
                items,
                selectedChatId,
                setSelectedChatId,
              }}
              onRowsRendered={onRowsRender}
              overscanCount={5}
              className="custom-scrollbar"
            />

            {isFetchingNextPage && (
              <>
                <ChatRowSkeleton />
                <ChatRowSkeleton />
              </>
            )}
          </>
        )}

        {items.length === 0 && !isLoading && <NoConversationSkeleton />}
      </div>
    </aside>
  );
};

export default ChatList;
