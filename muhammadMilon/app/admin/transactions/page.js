import { adminListPurchases } from "@/actions/admin";

export const metadata = {
  title: "Transactions · Admin",
};

export default async function AdminTransactionsPage() {
  const rows = await adminListPurchases();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Transactions</h1>
      <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--muted)]/40 text-xs uppercase text-[var(--muted-foreground)]">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Template</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-[var(--muted-foreground)]">
                  No transactions yet.
                </td>
              </tr>
            ) : null}
            {rows.map((r) => (
              <tr key={r.id} className="border-t border-[var(--border)]">
                <td className="px-4 py-3 text-xs text-[var(--muted-foreground)]">
                  {r.createdAt.toISOString().slice(0, 10)}
                </td>
                <td className="px-4 py-3">{r.user.email}</td>
                <td className="px-4 py-3">{r.template.name}</td>
                <td className="px-4 py-3">{r.status}</td>
                <td className="px-4 py-3">
                  {r.amountCents != null ? `$${(r.amountCents / 100).toFixed(2)}` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
