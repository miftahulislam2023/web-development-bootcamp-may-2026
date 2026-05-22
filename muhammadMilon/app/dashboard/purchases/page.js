import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { listMyPurchases } from "@/actions/marketplace";
import { PurchasesView } from "@/components/dashboard/PurchasesView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Purchases",
};

export default async function PurchasesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const purchases = await listMyPurchases();

  return (
    <Suspense fallback={<p className="text-sm text-[var(--muted-foreground)]">Loading purchases…</p>}>
      <PurchasesView purchases={purchases} />
    </Suspense>
  );
}
