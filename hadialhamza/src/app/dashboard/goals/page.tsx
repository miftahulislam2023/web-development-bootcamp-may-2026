import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import GoalContent from "@/components/dashboard/goals/GoalContent";

export default async function GoalsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return <GoalContent />;
}
