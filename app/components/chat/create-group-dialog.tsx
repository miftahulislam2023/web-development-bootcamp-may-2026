"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGroupCreated?: () => void;
}

export function CreateGroupDialog({ open, onOpenChange, onGroupCreated }: CreateGroupDialogProps) {
  const [friends, setFriends] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      fetchFriends();
      setSelectedIds(new Set());
      setGroupName("");
      setError("");
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

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) {
      setError("Group name is required");
      return;
    }
    if (selectedIds.size < 2) {
      setError("Please select at least 2 friends to form a group of 3");
      return;
    }

    setIsSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/chats/group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatName: groupName,
          users: Array.from(selectedIds),
        }),
      });
      const data = await res.json();
      if (data.success) {
        onGroupCreated?.();
        onOpenChange(false);
      } else {
        setError(data.message || "Failed to create group");
      }
    } catch (err) {
      setError("Error creating group");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Group Chat</DialogTitle>
          <DialogDescription>
            Select friends to start a new group conversation.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Input 
              placeholder="Group Name" 
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium text-foreground">Select Friends</h4>
            <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-2 border border-border rounded-md p-2 bg-card">
              {isLoading && <p className="text-xs text-muted-foreground p-2">Loading friends...</p>}
              {!isLoading && friends.length === 0 && (
                <p className="text-xs text-muted-foreground p-2">You don't have any friends yet.</p>
              )}
              {friends.map((f) => (
                <label key={f.friend._id} className="flex items-center gap-3 p-2 hover:bg-sidebar-accent rounded-md cursor-pointer transition-colors">
                  <input 
                    type="checkbox" 
                    className="size-4 accent-primary"
                    checked={selectedIds.has(f.friend._id)}
                    onChange={() => toggleSelect(f.friend._id)}
                  />
                  <div>
                    <p className="text-sm font-medium">{f.friend.username}</p>
                    <p className="text-xs text-muted-foreground">{f.friend.email}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Group"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
