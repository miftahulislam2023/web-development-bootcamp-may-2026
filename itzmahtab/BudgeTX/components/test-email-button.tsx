"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { sendTestEmail } from "@/actions/test-email";

export function TestEmailButton() {
  const [status, setStatus] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    setStatus(null);
    const result = await sendTestEmail();
    if (result.success) {
      setStatus({ message: `Email sent to ${result.email}`, type: "success" });
    } else {
      setStatus({ message: `Failed: ${result.error}`, type: "error" });
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
        {loading ? "Sending..." : "Send Test Email"}
      </Button>
      {status && (
        <p className={`text-sm ${status.type === "success" ? "text-green-600" : "text-red-600"}`}>
          {status.message}
        </p>
      )}
    </div>
  );
}
