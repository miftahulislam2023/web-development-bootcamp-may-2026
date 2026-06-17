import { useInfiniteQuery } from "@tanstack/react-query";

const useConversationMessages = (conversationId: string) => {
  return useInfiniteQuery({
    queryKey: ["conversation-messages", conversationId],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/message/v1/get/${conversationId}?page=${pageParam}`,
        { credentials: "include" },
      );
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message || "Conversation not found");
      }

      return data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.data?.meta.hasNextPage) return undefined;
      return lastPage?.data?.meta.nextPage;
    },
    getPreviousPageParam: (firstPage) => {
      if (!firstPage?.data?.meta.hasPreviousPage) return undefined;
      return firstPage?.data?.meta.prevPage;
    },
    gcTime: 10 * 60_000,
  });
};
export default useConversationMessages;
