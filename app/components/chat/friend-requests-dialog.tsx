"use client";

import { useState, useEffect } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FriendRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRequestHandled?: () => void;
}

export function FriendRequestsDialog({ open, onOpenChange, onRequestHandled }: FriendRequestsDialogProps) {
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open) {
      fetchRequests();
    }
  }, [open]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/friends/requests");
      const data = await res.json();
      if (data.success) {
        setRequests(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/friends/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests(requests.filter(r => r._id !== requestId));
        onRequestHandled?.();
      } else {
        alert(data.message || `Failed to ${action} request`);
      }
    } catch (err) {
      alert("Error processing request");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Friend Requests</DialogTitle>
          <DialogDescription>
            People who want to connect with you.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
          {isLoading && <p className="text-sm text-muted-foreground text-center py-4">Loading...</p>}
          {!isLoading && requests.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4">No pending requests.</p>
          )}
          {requests.map((req) => (
            <div key={req._id} className="flex items-center justify-between p-2 rounded-lg border border-border bg-card">
              <div>
                <p className="text-sm font-medium">{req.sender?.username || "Unknown"}</p>
                <p className="text-xs text-muted-foreground">{req.sender?.email || ""}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="icon-sm" 
                  variant="default"
                  onClick={() => handleAction(req._id, 'accept')}
                >
                  <Check className="size-4" />
                </Button>
                <Button 
                  size="icon-sm" 
                  variant="outline"
                  className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleAction(req._id, 'reject')}
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
