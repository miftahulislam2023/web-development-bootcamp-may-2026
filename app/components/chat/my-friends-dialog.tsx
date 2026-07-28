"use client";

import { useState, useEffect } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChatContext } from "@/providers/chat-provider";

interface MyFriendsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MyFriendsDialog({ open, onOpenChange }: MyFriendsDialogProps) {
  const [friends, setFriends] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStartingChat, setIsStartingChat] = useState<string | null>(null);
  const { refetchChats, selectChat } = useChatContext();

  useEffect(() => {
    if (open) {
      fetchFriends();
    }
  }, [open]);

  const fetchFriends = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/friends");
      const data = await res.json();
      if (data.success) {
        setFriends(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartChat = async (friendId: string) => {
    if (isStartingChat) return;
    setIsStartingChat(friendId);
    
    try {
      const res = await fetch("/api/chats/private", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ friendId }),
      });
      const data = await res.json();
      
      if (data.success && data.data) {
        await refetchChats(); // Update sidebar chats
        selectChat(data.data._id); // Open the chat
        onOpenChange(false); // Close dialog
      } else {
        alert(data.message || "Failed to start chat");
      }
    } catch (err) {
      alert("Error starting chat");
    } finally {
      setIsStartingChat(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>My Friends</DialogTitle>
          <DialogDescription>
            Start a conversation with an accepted friend.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {isLoading && <p className="text-sm text-muted-foreground text-center py-4">Loading friends...</p>}
          {!isLoading && friends.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No friends found.</p>
          )}
          {friends.map((f) => (
            <div key={f.friend._id} className="flex items-center justify-between p-2 rounded-lg border border-border bg-card">
              <div>
                <p className="text-sm font-medium">{f.friend.username}</p>
                <p className="text-xs text-muted-foreground">{f.friend.email}</p>
              </div>
              <Button 
                size="sm" 
                variant="secondary"
                disabled={isStartingChat === f.friend._id}
                onClick={() => handleStartChat(f.friend._id)}
              >
                {isStartingChat === f.friend._id ? "Starting..." : <><MessageCircle className="size-3.5 mr-1"/> Chat</>}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
