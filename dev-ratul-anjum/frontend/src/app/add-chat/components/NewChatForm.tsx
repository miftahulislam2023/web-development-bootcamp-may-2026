"use client";
import ChatRowSkeleton from "@/components/ChatRowSkeleton";
import useDebounce from "@/hooks/useDebounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { List } from "react-window";
import NoContactsFound from "./NoContactsFound";
import NoSearchYet from "./NoSearchYet";
import addConversation from "@/actions/addConversation";
import UserRow from "./UserRow";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

const NewChatForm = () => {
  const [query, setQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

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
    queryKey: ["contacts", debouncedSearch],
    queryFn: async ({ pageParam }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/v1/chats/available-users?query=${query}&page=${pageParam}`,
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
    enabled: query.length > 0,
    gcTime: 5 * 60_000,
  });

  const items = data?.pages.flatMap((page) => page?.data?.users) || [];
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

  useEffect(() => {
    return () => {
      setQuery("");
    };
  }, []);

  const handleAddConversation = async (selectedUserId: string) => {
    if (isCreating) return;

    setIsCreating(true);

    const res = await addConversation(selectedUserId);

    if (res.success) {
      toast.success("Conversation created!", {
        className:
          "bg-[#00875F] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
      setIsCreating(false);
      setSelectedUserId(null);
      setQuery("");

      redirect(`/rooms/${res.conversationId}`);
    } else {
      toast.error(res.message, {
        className:
          "bg-[#C53030] text-white rounded-md shadow-md px-4 py-2 text-sm",
        progressClassName: "bg-white/50",
      });
      setIsCreating(false);
      setSelectedUserId(null);
      setQuery("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header for context (optional but good for UX) */}
      <div className="flex h-15 items-center gap-3 bg-[#008069] px-4 text-white">
        <Link prefetch={false} href="/rooms">
          <ArrowLeft className="h-5 w-5 cursor-pointer" />
        </Link>
        <span className="text-lg font-medium">New chat</span>
      </div>

      <div className="flex flex-col p-4 gap-4">
        {/* 1. Single Input Box */}
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-[#008069] ml-1">
            Email Address or Name
          </label>
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedUserId(null);
              debouncedSearchChange(e.target.value);
            }}
            placeholder="Type name or email here"
            className="w-full border-b-2 border-[#008069] py-1 text-base outline-none focus:border-[#008069]"
          />
        </div>

        {/* 2. Add Button */}
        <button
          disabled={!selectedUserId || isCreating}
          className="w-full rounded-md bg-[#008069] py-2 text-sm font-medium text-white shadow-sm transition hover:bg-[#006d59] cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
          onClick={() => {
            if (selectedUserId) {
              handleAddConversation(selectedUserId);
            }
          }}
        >
          {isCreating ? "ADDING..." : "ADD CHAT"}
        </button>
      </div>

      {/* 3. List of filtered users */}
      <div className="flex-1 h-0">
        <div className="px-4 py-2 text-xs font-medium text-[#008069] uppercase tracking-wide">
          Contacts on Dialog
        </div>

        {!query ? (
          <NoSearchYet />
        ) : isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <ChatRowSkeleton key={i} />)
        ) : items.length > 0 ? (
          <>
            <List
              rowComponent={UserRow}
              rowCount={totalRow}
              rowHeight={65}
              rowProps={{ items, selectedUserId, setSelectedUserId, setQuery }}
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
        ) : (
          <NoContactsFound />
        )}
      </div>
    </div>
  );
};

export default NewChatForm;
