"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { BanknoteArrowDown, BanknoteArrowUp } from "lucide-react";
import CreateTransactionModal from "@/components/pages/dashboard/transactions/ui/create-transaction-modal";

export default function DashboardNavbar() {
  const { data: session } = useSession();

  return (
    <div className="flex flex-col md:flex md:flex-row md:justify-between w-full">
      <h1 className="text-2xl mb-5 md:mb-0 md:text-3xl font-bold">
        Hello, {session?.user.name} 👋
      </h1>

      <div className="flex items-center gap-x-3">
        <CreateTransactionModal
          userId={session?.user?.id as string}
          type="income"
          modalTrigger={
            <Button size="lg" variant="default">
              Add Income <BanknoteArrowDown />
            </Button>
          }
        />
        <CreateTransactionModal
          userId={session?.user?.id as string}
          type="expense"
          modalTrigger={
            <Button size="lg" variant="destructive">
              Add Expense <BanknoteArrowUp />
            </Button>
          }
        />
      </div>
    </div>
  );
}
