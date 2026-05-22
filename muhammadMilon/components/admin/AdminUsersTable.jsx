"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminSetUserBlocked, adminSetUserRole } from "@/actions/admin";
import { Button } from "@/components/ui/Button";

export function AdminUsersTable({ users }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  function run(fn) {
    start(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--muted)]/40 text-xs uppercase text-[var(--muted-foreground)]">
          <tr>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-t border-[var(--border)]">
              <td className="px-4 py-3 font-medium">{u.email}</td>
              <td className="px-4 py-3">{u.role}</td>
              <td className="px-4 py-3">{u.blockedAt ? "Blocked" : "Active"}</td>
              <td className="space-x-2 px-4 py-3 text-right">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  disabled={pending}
                  onClick={() => run(() => adminSetUserBlocked(u.id, !u.blockedAt))}
                >
                  {u.blockedAt ? "Unblock" : "Block"}
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  disabled={pending}
                  onClick={() =>
                    run(() => adminSetUserRole(u.id, u.role === "admin" ? "user" : "admin"))
                  }
                >
                  {u.role === "admin" ? "Set as user" : "Set as admin"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
