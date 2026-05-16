"use client";

import { useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FindFriendsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FindFriendsDialog({ open, onOpenChange }: FindFriendsDialogProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/users?search=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.data);
      } else {
        setError(data.message || "Failed to find users");
      }
    } catch (err) {
      setError("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      const res = await fetch("/api/friends/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId: userId }),
      });
      const data = await res.json();
      if (data.success) {
        setSentRequests((prev) => ({ ...prev, [userId]: true }));
      } else {
        alert(data.message || "Failed to send request");
      }
    } catch (err) {
      alert("Error sending request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Find Friends</DialogTitle>
          <DialogDescription>
            Search for users by username or email to send a friend request.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSearch} className="flex items-center gap-2 mt-2">
          <Input 
            placeholder="Search username or email..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
            {isLoading ? "Searching..." : "Search"}
          </Button>
        </form>

        {error && <p className="text-sm text-red-500 mt-2">{error}</p>}

        <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {users.length === 0 && !isLoading && searchQuery && (
            <p className="text-sm text-muted-foreground text-center py-4">No users found.</p>
          )}
          {users.map((user) => (
            <div key={user._id} className="flex items-center justify-between p-2 rounded-lg border border-border bg-card">
              <div>
                <p className="text-sm font-medium">{user.username}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
              <Button 
                size="sm" 
                variant={sentRequests[user._id] ? "outline" : "default"}
                disabled={sentRequests[user._id]}
                onClick={() => handleSendRequest(user._id)}
              >
                {sentRequests[user._id] ? "Sent" : <><UserPlus className="size-3.5 mr-1"/> Request</>}
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
