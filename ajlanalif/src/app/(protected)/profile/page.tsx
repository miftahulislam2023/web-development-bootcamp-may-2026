import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { ProfileCard } from "@/components/profile/profile-card";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  const joinedDate = null;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <ProfileCard
        initialProfile={{
          name: session?.user?.name ?? null,
          username: session?.user?.username ?? null,
          email: session?.user?.email ?? null,
          bio: session?.user?.bio ?? null,
          image: session?.user?.image ?? null,
        }}
      />
    </main>
  );
}
