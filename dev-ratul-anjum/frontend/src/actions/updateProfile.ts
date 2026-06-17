"use server";

import { getDecodedCookies } from "@/lib/cookies";

const updateProfile = async (profileInfo: {
  name: string;
  bio: string;
  photo: null | File;
}) => {
  const { name, bio, photo } = profileInfo;

  const formData = new FormData();
  if (name.trim()) formData.append("name", name);
  if (bio.trim()) formData.append("bio", bio);
  if (photo) formData.append("photo", photo);

  const cookieHeader = await getDecodedCookies();
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/v1/update-profile`,
      {
        method: "PATCH",
        credentials: "include",
        body: formData,
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
      message = "Failed to update profile. Please try again later.";
    } else {
      message = "Unexpected error occurred. Please try again.";
    }

    return { success: false, message };
  }
};

export default updateProfile;
