import { adminListUsers } from "@/actions/admin";
import { AdminUsersPanel } from "@/components/admin/AdminUsersPanel";

export const metadata = { title: "Users · Admin" };

export default async function AdminUsersPage() {
  const users = await adminListUsers();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">User management</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Create accounts, assign roles, block, or soft-delete users.
        </p>
      </div>
      <AdminUsersPanel users={users} />
    </div>
  );
}
