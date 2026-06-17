"use client";

import ConfirmationModal from "@/components/ConfirmationModal";
import useProfileDetails from "@/hooks/useProfileDetails";
import { authClient } from "@/lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  HelpCircle,
  Keyboard,
  Lock,
  LogOut,
  MessageCircle,
  Monitor,
  Search,
  ShieldCheck,
  UserIcon,
  Video,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Settings = () => {
  const { data: profile, isLoading } = useProfileDetails();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  const router = useRouter();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: async () => {
          // clear all react-query cache
          queryClient.clear();

          // redirect
          router.replace("/login");

          // refresh app router state
          router.refresh();
        },
      },
    });
  };
  return (
    <div className="flex flex-col h-full bg-[#f0f2f5] animate-in slide-in-from-left duration-200">
      <header className="flex h-15 items-center px-4 bg-white border-b border-[#d1d7db]">
        <h1 className="text-xl font-bold">Settings</h1>
      </header>
      {/* <div className="p-3 bg-white"> */}
      {/* <div className="flex h-9 items-center rounded-lg bg-[#f0f2f5] px-3 focus-within:ring-1 ring-[#00a884]">
          <Search className="h-5 w-5 text-[#54656f]" />
          <input
            type="text"
            placeholder="Search settings"
            className="ml-4 w-full bg-transparent outline-none text-sm"
          />
        </div> */}
      {/* </div> */}
      <div className="flex-1 overflow-y-auto custom-scrollbar bg-white">
        <div className="flex items-center gap-4 px-4 py-3 hover:bg-[#f5f6f6] cursor-pointer">
          {profile?.image ? (
            <div className="relative h-12 w-12 cursor-pointer overflow-hidden rounded-full">
              <Image
                src={profile.image}
                alt="My Profile"
                className="h-full w-full object-cover"
                width={100}
                height={100}
              />
            </div>
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-white">
              <UserIcon className="h-6 w-6" />
            </div>
          )}

          {isLoading ? (
            <div className="flex-1 animate-pulse space-y-2">
              {/* Name */}
              <div className="h-4 w-32 rounded bg-gray-200" />

              {/* Bio */}
              <div className="h-3 w-56 rounded bg-gray-200" />
            </div>
          ) : (
            <div className="flex-1">
              <p className="font-medium">{profile?.name}</p>
              <p className="text-sm text-[#667781]">
                {profile?.bio ? profile.bio : "Hey there! I am using Dialog."}
              </p>
            </div>
          )}
        </div>

        {/* {[
          { icon: Monitor, label: "General", sub: "Startup and close" },
          {
            icon: ShieldCheck,
            label: "Account",
            sub: "Security notifications, account info",
          },
          {
            icon: Lock,
            label: "Privacy",
            sub: "Blocked contacts, disappearing messages",
          },
          {
            icon: MessageCircle,
            label: "Chats",
            sub: "Theme, wallpaper, chat settings",
          },
          {
            icon: Video,
            label: "Video & voice",
            sub: "Camera, microphone & speakers",
          },
          {
            icon: Bell,
            label: "Notifications",
            sub: "Message notifications",
          },
          {
            icon: Keyboard,
            label: "Keyboard shortcuts",
            sub: "Quick actions",
          },
          {
            icon: HelpCircle,
            label: "Help and feedback",
            sub: "Help centre, contact us",
          },
        ].map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-5 px-6 py-3 hover:bg-[#f5f6f6] cursor-pointer"
          >
            <item.icon className="h-5 w-5 text-[#54656f]" />
            <div className="border-b border-[#e9edef] flex-1 pb-3">
              <p className="text-base">{item.label}</p>
              <p className="text-xs text-[#667781]">{item.sub}</p>
            </div>
          </div>
        ))} */}

        <div
          className="flex items-center gap-5 px-6 py-4 text-red-500 hover:bg-[#f5f6f6] cursor-pointer"
          onClick={() => setIsLogoutModalOpen(true)}
        >
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Log out</span>
        </div>

        <ConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
          title="Log out?"
          description="You’ll be signed out of your account and will need to log in again to continue."
          cancelValue="Cancel"
          confirmValue="Yes, Log out"
        />
      </div>
    </div>
  );
};

export default Settings;
