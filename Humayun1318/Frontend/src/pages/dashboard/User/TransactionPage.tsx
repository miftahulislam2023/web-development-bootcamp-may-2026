import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { ITransaction } from "@/types";
import { ReusablePagination } from "@/components/ReusablePagination";
import { AddEditTransactionModal } from "@/components/modules/dashboard/user/transaction/AddEditTransactionModal";
import { Input } from "@/components/ui/input";
import { useGetAllTransactionsQuery } from "@/redux/features/transactions/transactions.api";
import { DeleteTransactionModal } from "@/components/modules/dashboard/user/transaction/DeleteTransactionModal";
import { TransactionTable } from "@/components/modules/dashboard/user/transaction/TransactionTable";

export default function TransactionPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ── Modal states ─────────────────────────────────────────────────────────────

  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ITransaction | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ITransaction | null>(null);

  // ── Data ─────────────────────────────────────────────────────────────────────

  const { data, isLoading } = useGetAllTransactionsQuery({
    searchTerm: debouncedSearch || undefined,
    sort: "-createdAt",
    page: currentPage,
    limit,
  });

  const transactions: ITransaction[] = Array.isArray(data?.data) ? data.data : [];
  const totalPages: number = data?.meta?.totalPages ?? 1;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const openAdd = () => {
    setEditTarget(null);
    setAddEditOpen(true);
  };

  const openEdit = (transaction: ITransaction) => {
    setEditTarget(transaction);
    setAddEditOpen(true);
  };

  const openDelete = (transaction: ITransaction) => {
    setDeleteTarget(transaction);
    setDeleteOpen(true);
  };

  const closeAddEdit = () => {
    setAddEditOpen(false);
    setEditTarget(null);
  };

  const closeDelete = () => {
    setDeleteOpen(false);
    setDeleteTarget(null);
  };

  // ── Debounce search ─────────────────────────────────────────────────────────
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchTerm(value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setDebouncedSearch(value);
      setCurrentPage(1);
    }, 500);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-7xl mx-auto px-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-8 gap-4">
        <div>
          <h1 className="text-xl font-semibold">Transactions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your income and expense transactions.
          </p>
        </div>
        <Button onClick={openAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Transaction
        </Button>
      </div>

      {/* Search Field - Under Description */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search transactions by title, description, category..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-9 pr-4 py-2 w-full"
          />
        </div>
        {searchTerm && (
          <p className="text-xs text-muted-foreground mt-1">
            Searching for: "{searchTerm}"
          </p>
        )}
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="border border-muted rounded-md py-16 flex items-center justify-center">
          <p className="text-muted-foreground text-sm">Loading transactions…</p>
        </div>
      ) : (
        <>
          {transactions.length === 0 && debouncedSearch ? (
            <div className="border border-muted rounded-md py-16 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                No transactions found matching "{debouncedSearch}"
              </p>
            </div>
          ) : (
            <TransactionTable
              data={transactions}
              onEdit={openEdit}
              onDelete={openDelete}
            />
          )}
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end mt-4">
          <ReusablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* Add / Edit Modal */}
      <AddEditTransactionModal
        open={addEditOpen}
        onClose={closeAddEdit}
        editData={editTarget}
      />

      {/* Delete Confirmation Modal */}
      <DeleteTransactionModal
        open={deleteOpen}
        onClose={closeDelete}
        transactionId={deleteTarget?._id ?? null}
        transactionTitle={deleteTarget?.type}
      />
    </div>
  );
}