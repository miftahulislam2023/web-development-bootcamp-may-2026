import Categories from "@/components/pages/dashboard/categories/categories";
import { ITransactionsSearchParams } from "@/interfaces/interfaces";

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<ITransactionsSearchParams>;
}) {
  return <Categories searchParams={searchParams} />;
}