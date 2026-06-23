"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";

import { LogoutButton } from "@/components/auth/logout-button";

type ProfileCardProps = {
  initialProfile: {
    name: string | null;
    username: string | null;
    email: string | null;
    bio: string | null;
    image: string | null;
  };
};

type ProfileFormState = {
  name: string;
  username: string;
  bio: string;
};

export function ProfileCard({ initialProfile }: ProfileCardProps) {
  const router = useRouter();
  const { update } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileFormState>({
    name: initialProfile.name ?? "",
    username: initialProfile.username ?? "",
    bio: initialProfile.bio ?? "",
  });

  useEffect(() => {
    setProfile({
      name: initialProfile.name ?? "",
      username: initialProfile.username ?? "",
      bio: initialProfile.bio ?? "",
    });
  }, [initialProfile.bio, initialProfile.name, initialProfile.username]);

  const avatarSeed = profile.username || profile.name || initialProfile.email || "User";
  const avatarUrl = initialProfile.image ?? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}`;

  async function handleSave() {
    setIsSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      });

      const payload = (await response.json().catch(() => null)) as
        | {
            message?: string;
            user?: { name: string | null; username: string | null; bio: string | null; image: string | null; email: string | null };
          }
        | null;

      if (!response.ok || !payload?.user) {
        throw new Error(payload?.message ?? "Failed to update profile.");
      }

      await update({
        name: payload.user.name,
        username: payload.user.username,
        bio: payload.user.bio,
        image: payload.user.image,
      });

      toast.success("Profile updated.");
      setIsEditing(false);
      router.refresh();
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : "Failed to update profile.";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="rounded-[28px] border border-cyan-400/12 bg-slate-950/75 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl sm:p-8">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <Image
            src={avatarUrl}
            alt="Profile avatar"
            width={88}
            height={88}
            className="rounded-3xl border border-cyan-400/15 bg-slate-900 object-cover shadow-lg"
          />
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200/80">Profile</p>
            {isEditing ? (
              <div className="mt-3 space-y-3">
                <input
                  value={profile.name}
                  onChange={(event) => setProfile((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Display name"
                  className="block w-full rounded-2xl border border-cyan-400/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                />
                <input
                  value={profile.username}
                  onChange={(event) => setProfile((current) => ({ ...current, username: event.target.value }))}
                  placeholder="Username"
                  className="block w-full rounded-2xl border border-cyan-400/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                />
                <textarea
                  value={profile.bio}
                  onChange={(event) => setProfile((current) => ({ ...current, bio: event.target.value }))}
                  placeholder="Short bio"
                  rows={4}
                  className="block w-full rounded-2xl border border-cyan-400/10 bg-slate-900/80 px-3 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-400/25"
                />
              </div>
            ) : (
              <>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-50">
                  {profile.name || profile.username || "Unnamed user"}
                </h1>
                <p className="mt-2 text-sm text-slate-300">{profile.bio || "No bio yet."}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link href="/dm" className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900">
            DMs
          </Link>
          <Link href="/chat" className="rounded-full border border-cyan-400/20 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/35 hover:bg-slate-900">
            Rooms
          </Link>
          {isEditing ? (
            <>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-full border border-slate-400/20 bg-slate-950/60 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:border-slate-300/35 hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleSave()}
                disabled={isSaving}
                className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Edit profile
            </button>
          )}
          <LogoutButton />
        </div>
      </div>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
          <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Username</dt>
          <dd className="mt-2 text-sm font-medium text-slate-100">{profile.username || "Not set"}</dd>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
          <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Email</dt>
          <dd className="mt-2 text-sm font-medium text-slate-100">{initialProfile.email ?? "No email"}</dd>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
          <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Bio</dt>
          <dd className="mt-2 text-sm font-medium text-slate-100">{profile.bio || "No bio added yet."}</dd>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/5 p-4">
          <dt className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">Joined</dt>
          <dd className="mt-2 text-sm font-medium text-slate-100">Not available in session</dd>
        </div>
      </dl>
    </section>
  );
}