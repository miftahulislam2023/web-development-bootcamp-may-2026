"use server";

import { getDecodedCookies } from "@/lib/cookies";

const blockUser = async (blockedId: string) => {
  if (!blockedId) return;

  const cookieHeader = await getDecodedCookies();

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/v1/block/${blockedId}`,

      {
        method: "POST",
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
      message = "Failed to block this user. Please try again later.";
    } else {
      message = "Unexpected error occurred. Please try again.";
    }

    return { success: false, message };
  }
};

export default blockUser;
