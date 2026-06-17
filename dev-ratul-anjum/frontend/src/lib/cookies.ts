import { cookies } from "next/headers";

export async function getDecodedCookies(): Promise<string> {
  const cookieStore = await cookies();

  const cookieHeader = cookieStore.toString();

  return cookieHeader;
}
