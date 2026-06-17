import {
  Bell,
  ChevronRight,
  History,
  Lock,
  Phone,
  Search,
  Star,
  UserIcon,
  Users,
  Video,
  X,
} from "lucide-react";

import { ActiveSidebarTab } from "./ChatArea";

import Image from "next/image";
import useConversationInfo from "@/hooks/useConversationInfo";
import { notFound } from "next/navigation";
import ContactInfoSkeleton from "./ContactInfoSkeleton";
import ConversationActionButtons from "./ConversationActionButtons";

const ChatActionsSidebar = ({
  activeSidebarTab,
  setActiveSidebarTab,
  conversationId,
  data,
}: SidebarProps) => {
  const {
    data: info,
    isLoading,
    isError,
    error,
  } = useConversationInfo(conversationId);

  if (info?.success === false) {
    notFound();
  }

  if (isError) return <p>Error: {error.message}</p>;
  return (
    <aside
      id="contact-info-panel"
      className={`absolute inset-0 z-20 flex h-full w-full flex-col border-l border-[#e9edef] bg-white transition-transform duration-300 ease-in-out lg:static lg:w-100 lg:translate-x-0 
          ${activeSidebarTab ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* Header - updated button */}
      <header className="flex h-15 items-center gap-4 border-b border-[#e9edef] bg-[#f0f2f5] px-4">
        <button
          onClick={() => setActiveSidebarTab(null)}
          className="text-[#54656f] cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-base font-medium">Contact info</h2>
      </header>

      <div className="custom-scrollbar flex-1 overflow-y-auto bg-[#d1d7db]">
        {isLoading ? (
          <ContactInfoSkeleton />
        ) : (
          <>
            {/* Profile Section */}
            <div className="mb-2 flex flex-col items-center bg-white p-6 shadow-sm">
              {info?.data.participantPhoto ? (
                <Image
                  src={info.data.participantPhoto}
                  alt="Profile"
                  className="mb-4 rounded-full w-37.5 h-37.5 object-cover"
                  height={150}
                  width={150}
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gray-300 text-white mb-4">
                  <UserIcon className="h-10 w-10" />
                </div>
              )}
              <h2 className="text-xl font-medium text-[#111b21]">
                {info?.data.participantName}
              </h2>
              <p className="mt-1 text-base text-[#667781]">
                {info?.data.participantEmail}
              </p>

              {/* Action Buttons */}
              {/* <div className="mt-6 flex w-full justify-center gap-4">
                <div className="group flex flex-col items-center gap-1 cursor-pointer">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9edef] text-[#00a884] shadow-sm group-hover:bg-gray-50">
                    <Phone className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-[#00a884]">
                    Audio
                  </span>
                </div>
                <div className="group flex flex-col items-center gap-1 cursor-pointer">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9edef] text-[#00a884] shadow-sm group-hover:bg-gray-50">
                    <Video className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-[#00a884]">
                    Video
                  </span>
                </div>
                <div className="group flex flex-col items-center gap-1 cursor-pointer">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e9edef] text-[#00a884] shadow-sm group-hover:bg-gray-50">
                    <Search className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium text-[#00a884]">
                    Search
                  </span>
                </div>
              </div> */}
            </div>

            {/* About Section */}
            <div className="mb-2 bg-white p-4 shadow-sm">
              <p className="mb-1 text-sm text-[#667781]">About</p>
              <p className="text-base text-[#111b21]">
                {info?.data.participantBio
                  ? info.data.participantBio
                  : "Hey there! I am using Dialog."}
              </p>
            </div>
          </>
        )}

        {/* Media Section */}
        <div
          className="mb-2 flex cursor-pointer justify-between items-center bg-white p-4 shadow-sm hover:bg-gray-50"
          onClick={() => setActiveSidebarTab("allMedia")}
        >
          <p className="text-sm font-medium text-[#667781]">Media Gallery</p>
          <div className="flex items-center gap-1 text-[#667781]">
            <span className="text-xs">{info?.data.totalAttachments}</span>
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>

        {/* Options List */}
        <div className="mb-2 bg-white shadow-sm">
          <div
            className="flex cursor-pointer items-center gap-4 p-4 hover:bg-gray-50"
            onClick={() => setActiveSidebarTab("starredMessages")}
          >
            <Star className="h-5 w-5 text-[#54656f]" />
            <p className="flex-1 text-base text-[#111b21]">Starred messages</p>
            <ChevronRight className="h-4 w-4 text-[#667781]" />
          </div>
          {/* <div className="flex cursor-pointer items-center gap-4 border-t border-[#e9edef] p-4 hover:bg-gray-50">
            <Bell className="h-5 w-5 text-[#54656f]" />
            <p className="flex-1 text-base text-[#111b21]">
              Notification settings
            </p>
            <ChevronRight className="h-4 w-4 text-[#667781]" />
          </div>
          <div className="flex cursor-pointer items-center gap-4 border-t border-[#e9edef] p-4 hover:bg-gray-50">
            <Lock className="h-5 w-5 text-[#54656f]" />
            <div className="flex-1">
              <p className="text-base text-[#111b21]">Encryption</p>
              <p className="text-xs text-[#667781]">
                Messages are end-to-end encrypted.
              </p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#667781]" />
          </div>
          <div className="flex cursor-pointer items-center gap-4 border-t border-[#e9edef] p-4 hover:bg-gray-50">
            <History className="h-5 w-5 text-[#54656f]" />
            <div className="flex-1">
              <p className="text-base text-[#111b21]">Disappearing messages</p>
              <p className="text-xs text-[#667781]">Off</p>
            </div>
            <ChevronRight className="h-4 w-4 text-[#667781]" />
          </div> */}
        </div>

        {/* Groups Common */}
        {/* <div className="mb-8 bg-white shadow-sm">
          <p className="px-4 pb-2 pt-4 text-sm text-[#667781]">
            3 groups in common
          </p>

          <div className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-gray-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-[#54656f]">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base text-[#111b21]">@Abu@Ratul@Fuad</p>
              <p className="text-xs text-[#667781]">Abu, +880 1540..., You</p>
            </div>
          </div>
        </div> */}

        {/* Block/Report/Delete */}
        <ConversationActionButtons
          conversationId={conversationId}
          participantName={info?.data.participantName}
          participantId={info?.data.participantId}
          data={data}
        />
      </div>
    </aside>
  );
};

export default ChatActionsSidebar;

type SidebarProps = {
  activeSidebarTab: ActiveSidebarTab;
  setActiveSidebarTab: (tab: ActiveSidebarTab) => void;
  conversationId: string;

  data: {
    isBlocked: boolean;
    blockedByMe: boolean;
  };
};
