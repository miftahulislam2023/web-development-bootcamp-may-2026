"use server";

import { getDecodedCookies } from "@/lib/cookies";

const deleteConversation = async (conversationId: string) => {
  if (!conversationId) return;

  const cookieHeader = await getDecodedCookies();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/conversation/v1/delete/${conversationId}`,

      {
        method: "DELETE",
        headers: {
          Cookie: cookieHeader,
        },
      },
    );

    const result = await res.json();

    return { success: result.success, message: result.message };
  } catch (error) {
    let message: string;
    if (error instanceof Error) {
      message = "Failed to delete conversation. Please try again later.";
    } else {
      message = "Unexpected error occurred. Please try again.";
    }

    return { success: false, message };
  }
};

export default deleteConversation;
