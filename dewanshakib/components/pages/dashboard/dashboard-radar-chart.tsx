import prisma from "@/prisma/prisma";
import { CategoryRadarChart } from "./ui/category-radar-chart";

export default async function DashboardRadarChart({
  userId,
}: {
  userId: string;
}) {
  const transactions = await prisma.transactions.findMany({
    where: {
      userId,
    },
    select: {
      type: true,
      category_name: true,
      amount: true,
    },
  });

  // console.log("transactions ================>\n", transactions);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full md:gap-x-5 mt-10">
      <CategoryRadarChart type="income" transactions={transactions} />
      <CategoryRadarChart type="expense" transactions={transactions} />
    </div>
  );
}
