// pages/dashboard/user/recurring/RecurringPage.tsx
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { IRecurrence } from "@/types";
import { useGetAllRecurringTransactionsQuery } from "@/redux/features/recurring/recurring.api";
import { RecurringTable } from "@/components/modules/dashboard/user/recurring/RecurringTable";
import { ReusablePagination } from "@/components/ReusablePagination";
import { AddEditRecurringModal } from "@/components/modules/dashboard/user/recurring/AddEditRecurringModal";
import { DeleteRecurringModal } from "@/components/modules/dashboard/user/recurring/DeleteRecurringModal";


export default function RecurringPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ── Modal states ─────────────────────────────────────────────────────────────
  const [addEditOpen, setAddEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<IRecurrence | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<IRecurrence | null>(null);

  // ── Data ─────────────────────────────────────────────────────────────────────
  const { data, isLoading } = useGetAllRecurringTransactionsQuery({
    searchTerm: debouncedSearch || undefined,
    sort: "-createdAt",
    page: currentPage,
    limit,
  });

  const recurringTransactions: IRecurrence[] = Array.isArray(data?.data) ? data.data : [];
  const totalPages: number = data?.meta?.totalPages ?? 1;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Handlers ─────────────────────────────────────────────────────────────────
  const openAdd = () => {
    setEditTarget(null);
    setAddEditOpen(true);
  };

  const openEdit = (recurring: IRecurrence) => {
    setEditTarget(recurring);
    setAddEditOpen(true);
  };

  const openDelete = (recurring: IRecurrence) => {
    setDeleteTarget(recurring);
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
          <h1 className="text-xl font-semibold">Recurring Transactions</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage your recurring income and expense transactions.
          </p>
        </div>
        <Button onClick={openAdd} className="w-full sm:w-auto">
          <Plus className="h-4 w-4 mr-1.5" />
          Add Recurring Transaction
        </Button>
      </div>

      {/* Search Field */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search recurring transactions by title, category..."
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
          <p className="text-muted-foreground text-sm">Loading recurring transactions…</p>
        </div>
      ) : (
        <>
          {recurringTransactions.length === 0 && debouncedSearch ? (
            <div className="border border-muted rounded-md py-16 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                No recurring transactions found matching "{debouncedSearch}"
              </p>
            </div>
          ) : (
            <RecurringTable
              data={recurringTransactions}
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
      <AddEditRecurringModal
        open={addEditOpen}
        onClose={closeAddEdit}
        editData={editTarget}
      />

      {/* Delete Confirmation Modal */}
      <DeleteRecurringModal
        open={deleteOpen}
        onClose={closeDelete}
        recurringId={deleteTarget?._id ?? null}
        recurringTitle={deleteTarget?.type}
      />
    </div>
  );
}