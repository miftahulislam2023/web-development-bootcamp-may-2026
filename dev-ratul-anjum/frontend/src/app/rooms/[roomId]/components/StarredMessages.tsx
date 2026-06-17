import { useEffect, useRef } from "react";
import { ArrowLeft, MoreVertical } from "lucide-react";
import { ActiveSidebarTab } from "./ChatArea";
import { useInfiniteQuery } from "@tanstack/react-query";
import StarredMessage, { StarredMessageItem } from "./StarredMessage";
import StarredMessagesSkeletonList from "./StarredMessageSkeleton";
import ChatLoadingSpinner from "./ChatLoadingSpinner";

const StarredMessages = ({
  conversationId,
  setActiveSidebarTab,
}: StarredMessagesProps) => {
  const loaderRef = useRef(null);
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["starred-messages", conversationId],
      queryFn: async ({ pageParam }) => {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/message/v1/starred-messages/${conversationId}?page=${pageParam}`,
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

  const allStarredMessages =
    data?.pages.flatMap((page) => page.data.messages) || [];
  const currentUserId = data?.pages[0]?.currentUserId;

  useEffect(() => {
    const onIntersection = (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    };
    const observer = new IntersectionObserver(onIntersection);

    if (observer && loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    // cleanup
    return () => {
      if (observer) observer.disconnect();
    };
  }, [hasNextPage, fetchNextPage, isFetchingNextPage]);

  return (
    <div className="min-h-screen bg-[#f0f2f5] flex justify-center font-ubuntu text-slate-900 w-full lg:w-100">
      <main className="w-full max-w-3xl bg-white shadow-sm flex flex-col h-full min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-10 bg-white flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <button
              className="p-1 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Go back"
              onClick={() => setActiveSidebarTab("contactInfo")}
            >
              <ArrowLeft className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="text-xl font-medium text-gray-800">
              Starred messages
            </h1>
          </div>
          {/* <button
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Menu"
          >
            <MoreVertical className="w-6 h-6 text-gray-600" />
          </button> */}
        </header>

        {/* Message List */}
        {isLoading ? (
          <StarredMessagesSkeletonList />
        ) : allStarredMessages.length > 0 ? (
          <section className="flex-1 overflow-y-auto custom-scrollbar">
            <ul className="flex flex-col pb-4">
              {allStarredMessages.map((msg: StarredMessageItem) => (
                <StarredMessage
                  key={msg.id}
                  item={msg}
                  currentUserId={currentUserId}
                />
              ))}
            </ul>

            {hasNextPage && <ChatLoadingSpinner ref={loaderRef} />}
          </section>
        ) : (
          <div className="container mx-auto px-4 py-8 text-center text-gray-500">
            No starred messages found.
          </div>
        )}
      </main>
    </div>
  );
};
export default StarredMessages;

type StarredMessagesProps = {
  setActiveSidebarTab: (tab: ActiveSidebarTab) => void;
  conversationId: string;
};
