import { useQuery } from "@tanstack/react-query";

const fetchConversationInfo = async (conversationId: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/conversation/v1/info/${conversationId}`,
    {
      credentials: "include",
    },
  );

  const data = await res.json();

  if (!data.success) {
    throw new Error(data.message || "Failed to fetch conversation info");
  }

  return data;
};

const useConversationInfo = (conversationId: string) => {
  return useQuery({
    queryKey: ["conversation-info", conversationId],
    queryFn: async () => await fetchConversationInfo(conversationId),
    enabled: !!conversationId,
  });
};

export default useConversationInfo;
