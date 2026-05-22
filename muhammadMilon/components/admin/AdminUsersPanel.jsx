"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  adminSetUserBlocked,
  adminSetUserRole,
  adminSoftDeleteUser,
  adminCreateUser,
} from "@/actions/admin";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";

export function AdminUsersPanel({ users }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  function run(fn) {
    start(async () => {
      const res = await fn();
      if (res?.ok === false) toast.error(res.error || "Action failed");
      else router.refresh();
    });
  }

  function onCreate(e) {
    e.preventDefault();
    start(async () => {
      const res = await adminCreateUser({ name, email, password, role });
      if (!res.ok) {
        toast.error(res.error || "Could not create user");
        return;
      }
      toast.success("User created");
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      router.refresh();
    });
  }

  return (
    <div className="space-y-8">
      <form
        onSubmit={onCreate}
        className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 space-y-4"
      >
        <h2 className="font-display text-lg font-semibold">Create user</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Creating…" : "Create user"}
        </Button>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--muted)]/40 text-xs uppercase text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-[var(--muted-foreground)]">
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u.id} className="border-t border-[var(--border)]">
                  <td className="px-4 py-3">
                    <p className="font-medium">{u.email}</p>
                    {u.name ? (
                      <p className="text-xs text-[var(--muted-foreground)]">{u.name}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 capitalize">{u.role}</td>
                  <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">{u.blockedAt ? "Blocked" : "Active"}</td>
                  <td className="space-x-1 px-4 py-3 text-right whitespace-nowrap">
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
                      {u.role === "admin" ? "→ User" : "→ Admin"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      disabled={pending}
                      className="text-red-500"
                      onClick={() => {
                        if (confirm(`Soft-delete ${u.email}?`)) {
                          run(() => adminSoftDeleteUser(u.id));
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
