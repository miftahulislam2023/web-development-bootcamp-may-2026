import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import BudgetContent from "@/components/dashboard/budgets/BudgetContent";

export default async function BudgetsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <BudgetContent />;
}
