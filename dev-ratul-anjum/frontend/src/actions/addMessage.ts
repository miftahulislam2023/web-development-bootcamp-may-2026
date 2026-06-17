"use server";

import { getDecodedCookies } from "@/lib/cookies";

const addMessage = async (
  receiverId: string,
  conversationId: string,
  text: string,
  attachments: File[],
) => {
  const formData = new FormData();
  formData.append("receiverId", receiverId);
  formData.append("conversationId", conversationId);
  formData.append("text", text.trim());

  if (attachments.length > 0) {
    attachments.forEach((attachment) => {
      formData.append("attachments", attachment);
    });
  }

  const cookieHeader = await getDecodedCookies();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/message/v1/create`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
        headers: {
          Cookie: cookieHeader,
        },
      },
    );
    const result = await res.json();
    if (result.success) {
      return { success: result.success, newMessage: result.data };
    } else {
      return { success: result.success, message: result.message };
    }
  } catch (error) {
    let message: string;
    if (error instanceof Error) {
      message = "Failed to create message. Please try again later.";
    } else {
      message = "Unexpected error occurred. Please try again.";
    }

    return { success: false, message };
  }
};

export default addMessage;
