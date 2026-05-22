import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "./_components/transaction-form";
import { getTransaction } from "@/actions/transaction";

export default async function AddTransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const accounts = (await getUserAccounts()) ?? [];
  const { edit: editId } = await searchParams;

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title ">Add Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
}