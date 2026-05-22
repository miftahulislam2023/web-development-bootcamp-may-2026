import { auth } from "@/lib/auth";
import prisma from "@/prisma/prisma";
import { headers } from "next/headers";
import Link from "next/link";
import TransactionsTable from "@/components/pages/dashboard/transactions/ui/transactions-table";
import {
  ITransactionsOrderByMap,
  ITransactionsPageProps,
} from "@/interfaces/interfaces";

export default async function Transactions({
  searchParams,
}: ITransactionsPageProps) {
  const params = await searchParams;
  const page = params?.page ? parseInt(params.page) : 1;
  const limit = 5;
  const skip = (page - 1) * limit;
  const orderByParam = (params?.orderBy ?? "date").toLowerCase();
  const orderDirParam = (params?.orderDir ?? "desc").toLowerCase();
  const orderDirection = orderDirParam === "asc" ? "asc" : "desc";
  const orderByMap: ITransactionsOrderByMap = {
    category: "category_name",
    type: "type",
    amount: "amount",
    date: "created_at",
  };
  const orderByField = orderByMap[orderByParam] ?? "created_at";
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="py-8 text-sm text-muted-foreground">
        Please sign in to see your transactions.
      </div>
    );
  }

  const transactions = await prisma.transactions.findMany({
    where: { userId: session.user.id },
    orderBy: { [orderByField]: orderDirection },
    select: {
      id: true,
      amount: true,
      description: true,
      category_name: true,
      type: true,
      created_at: true,
    },
    skip,
    take: limit,
  });

  const totalCount = transactions.length + 1;
  const totalPages = Math.max(Math.ceil(totalCount / limit), 1);
  const prevPage = page > 1 ? page - 1 : null;
  const nextPage = page < totalPages ? page + 1 : null;
  const sortParams = `orderBy=${encodeURIComponent(orderByParam)}&orderDir=${encodeURIComponent(orderDirection)}&limit=${limit}`;

  return (
    <div className="py-10 px-5">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">Transactions</h1>
      </div>
      {transactions && transactions.length > 0 ? (
        <>
          <TransactionsTable transactions={transactions} limit={limit} />
          <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              {prevPage ? (
                <Link
                  className="rounded-md border border-border/60 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                  href={`/dashboard/transactions?page=${prevPage}&${sortParams}`}
                >
                  Previous
                </Link>
              ) : (
                <span className="rounded-md border border-border/40 px-3 py-1.5 text-sm font-medium opacity-50">
                  Previous
                </span>
              )}
              {nextPage ? (
                <Link
                  className="rounded-md border border-border/60 px-3 py-1.5 text-sm font-medium text-foreground hover:bg-muted"
                  href={`/dashboard/transactions?page=${nextPage}&${sortParams}`}
                >
                  Next
                </Link>
              ) : (
                <span className="rounded-md border border-border/40 px-3 py-1.5 text-sm font-medium opacity-50">
                  Next
                </span>
              )}
            </div>
          </div>
        </>
      ) : (
        <div>
          <h1>No transaction inititated yet.</h1>
        </div>
      )}
    </div>
  );
}
