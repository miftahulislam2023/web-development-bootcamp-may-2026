"use client";

import useProfileDetails from "@/hooks/useProfileDetails";
import {
  CircleDashed,
  MessageSquareText,
  Settings,
  UserIcon,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavigationRail = () => {
  const pathname = usePathname();
  const isRoomsPage = pathname === "/rooms";

  const { data: profile } = useProfileDetails();

  return (
    <nav
      className={`fixed bottom-0 left-0 z-20 w-full flex-row items-center justify-between border-t border-[#e9edef] bg-[#f0f2f5] px-2 py-2 md:relative md:h-screen md:w-15 md:flex-col md:border-r md:border-t-0 md:px-0 md:py-3 ${!isRoomsPage ? "hidden md:flex" : "flex"}`}
    >
      {/* Top Icons (Left side on Mobile) */}
      <div className="flex w-full flex-row items-center justify-around md:flex-col md:gap-4">
        <Link
          href="/rooms"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#54656f] transition hover:bg-gray-200"
        >
          <MessageSquareText className="h-6 w-6" />
        </Link>

        {/* <Link
          href="/calls"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#54656f] transition hover:bg-gray-200"
        >
          <Users className="h-6 w-6" />
        </Link>

        <Link
          href="/status"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#54656f] transition hover:bg-gray-200"
        >
          <CircleDashed className="h-6 w-6" />
        </Link> */}
      </div>

      {/* Bottom Icons (Right side on Mobile) */}
      <div className="flex w-full flex-row items-center justify-around md:mb-2 md:flex-col md:gap-4">
        <Link
          href="/settings"
          className="flex h-10 w-10 items-center justify-center rounded-full text-[#54656f] transition hover:bg-gray-200"
        >
          <Settings className="h-6 w-6" />
        </Link>

        {profile?.image ? (
          <Link
            href="/profile"
            className="relative h-8 w-8 cursor-pointer overflow-hidden rounded-full"
          >
            <Image
              src={profile.image}
              alt="My Profile"
              className="h-full w-full object-cover"
              width={100}
              height={100}
            />
          </Link>
        ) : (
          <Link
            href="/profile"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-white"
          >
            <UserIcon className="h-4 w-4" />
          </Link>
        )}
      </div>
    </nav>
  );
};

export default NavigationRail;
