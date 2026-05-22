import Transactions from "@/components/pages/dashboard/transactions/transactions";
import { ITransactionsSearchParams } from "@/interfaces/interfaces";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<ITransactionsSearchParams>;
}) {
  return <Transactions searchParams={searchParams} />;
}
