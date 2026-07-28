"use client";

import { useCallback } from "react";
import { SidebarContent } from "@/components/chat/sidebar-content";
import { ChatHeader } from "@/components/chat/chat-header";
import { MessageList } from "@/components/chat/message-list";
import { MessageInput } from "@/components/chat/message-input";
import { EmptyChatState } from "@/components/chat/empty-chat-state";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMobileSidebar } from "@/hooks/use-mobile-sidebar";
import { useChatContext } from "@/providers/chat-provider";
import { useAuth } from "@/hooks/use-auth";

import { useSocket } from "@/providers/socket-provider";
import { useState } from "react";
import { FindFriendsDialog } from "./find-friends-dialog";
import { FriendRequestsDialog } from "./friend-requests-dialog";
import { CreateGroupDialog } from "./create-group-dialog";
import { MyFriendsDialog } from "./my-friends-dialog";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

/**
 * Root chat layout — sidebar + topbar + main chat area.
 *
 * Desktop (≥768px): persistent sidebar on the left.
 * Mobile  (<768px): sidebar becomes a slide-in sheet.
 */
export function ChatLayout() {
  const sidebar = useMobileSidebar();
  const { activeChat, sendMessage } = useChatContext();
  const { user } = useAuth();
  const { isConnected } = useSocket();
  const { refetchChats } = useChatContext();

  const [isFindFriendsOpen, setIsFindFriendsOpen] = useState(false);
  const [isRequestsOpen, setIsRequestsOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isMyFriendsOpen, setIsMyFriendsOpen] = useState(false);

  const handleSendMessage = useCallback(
    (content: string) => {
      if (!activeChat) return;
      sendMessage(content);
    },
    [activeChat, sendMessage],
  );

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <aside
        className="hidden w-[300px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex"
        aria-label="Sidebar navigation"
      >
        <SidebarContent 
          onOpenFindFriends={() => setIsFindFriendsOpen(true)}
          onOpenRequests={() => setIsRequestsOpen(true)}
          onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
          onOpenMyFriends={() => setIsMyFriendsOpen(true)}
        />
      </aside>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={sidebar.isOpen} onOpenChange={sidebar.toggle}>
        <SheetContent
          side="left"
          showCloseButton
          className="w-[300px] bg-sidebar p-0"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Sidebar navigation with direct messages and group chats
          </SheetDescription>
          <SidebarContent 
            onChatSelect={sidebar.close}
            onOpenFindFriends={() => { setIsFindFriendsOpen(true); sidebar.close(); }}
            onOpenRequests={() => { setIsRequestsOpen(true); sidebar.close(); }}
            onOpenCreateGroup={() => { setIsCreateGroupOpen(true); sidebar.close(); }}
            onOpenMyFriends={() => { setIsMyFriendsOpen(true); sidebar.close(); }}
          />
        </SheetContent>
      </Sheet>

      {/* Main area */}
      <div className="flex min-w-0 flex-1 flex-col min-h-0">
        {/* Top bar */}
        <header className="flex items-center justify-between border-b border-border px-5 py-3 shrink-0">
          <div className="flex items-center gap-2">
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground md:hidden"
              onClick={sidebar.open}
              aria-label="Open sidebar"
            >
              <Menu className="size-5" />
            </Button>

            {activeChat ? (
              <span className="text-sm font-medium text-foreground">
                {activeChat.name}
              </span>
            ) : (
              <span className="text-sm font-medium text-foreground">
                DevConnect
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`size-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="hidden sm:inline">{isConnected ? 'Connected' : 'Disconnected'}</span>
            </div>
            
            <ThemeToggle />
            
            {user && (
              <div className="flex items-center gap-2">
                <Avatar size="default">
                  <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs font-semibold">
                    {getInitials(user.username)}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden text-sm font-medium text-foreground sm:inline">
                  {user.username}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* Chat area */}
        <main className="flex min-w-0 min-h-0 flex-1 flex-col bg-background">
          {activeChat ? (
            <>
              <ChatHeader
                chat={activeChat}
              />

              <MessageList
                messages={activeChat.messages}
                isGroup={activeChat.type === "group"}
              />

              <div className="border-t border-border px-4 pb-4 pt-3 md:px-6">
                <MessageInput
                  onSend={handleSendMessage}
                  placeholder={`Message ${activeChat.name}…`}
                />
              </div>
            </>
          ) : (
            <EmptyChatState 
              onOpenFindFriends={() => setIsFindFriendsOpen(true)}
              onOpenRequests={() => setIsRequestsOpen(true)}
            />
          )}
        </main>
      </div>

      <FindFriendsDialog open={isFindFriendsOpen} onOpenChange={setIsFindFriendsOpen} />
      <FriendRequestsDialog 
        open={isRequestsOpen} 
        onOpenChange={setIsRequestsOpen} 
        onRequestHandled={() => refetchChats()} 
      />
      <CreateGroupDialog 
        open={isCreateGroupOpen} 
        onOpenChange={setIsCreateGroupOpen} 
        onGroupCreated={() => refetchChats()} 
      />
      <MyFriendsDialog 
        open={isMyFriendsOpen} 
        onOpenChange={setIsMyFriendsOpen} 
      />
    </div>
  );
}
