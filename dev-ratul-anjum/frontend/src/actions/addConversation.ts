"use server";

import { getDecodedCookies } from "@/lib/cookies";

const addConversation = async (userId: string) => {
  const cookieHeader = await getDecodedCookies();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/conversation/v1/create`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          participantId: userId,
        }),
        headers: {
          Cookie: cookieHeader,
          "Content-Type": "application/json",
        },
      },
    );

    const result = await res.json();

    return {
      success: result.success,
      message: result.message,
      conversationId: result?.data?.conversationId,
    };
  } catch (error) {
    let message: string;
    if (error instanceof Error) {
      message = "Failed to create conversation. Please try again later.";
    } else {
      message = "Unexpected error occurred. Please try again.";
    }
    return { success: false, message };
  }
};

export default addConversation;
