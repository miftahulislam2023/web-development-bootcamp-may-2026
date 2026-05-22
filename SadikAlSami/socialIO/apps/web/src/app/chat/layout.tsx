import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import { ProfileGuard } from "@/components/providers/profile-guard";

export const metadata: Metadata = {
	title: "Chat — social.io",
	description: "Your conversations on social.io",
};

/**
 * @description
 * Chat-specific layout — Server Component.
 * Runs auth check, redirects to /login if no session,
 * and wraps children in ProfileGuard.
 * No Header rendered — chat is a full-screen experience.
 */
export default async function ChatLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
			throw: true,
		},
	});

	if (!session?.user) {
		redirect("/login");
	}

	return (
		<ProfileGuard>
			<div className="flex h-full overflow-hidden">{children}</div>
		</ProfileGuard>
	);
}
