import { UserActionModal } from "@/components/modules/dashboard/admin/allUsers/UserActionModal";
import { UsersFilters } from "@/components/modules/dashboard/admin/allUsers/UsersFilters";
import { UsersTable } from "@/components/modules/dashboard/admin/allUsers/UsersTable";
import { ReusablePagination } from "@/components/ReusablePagination";
import { useGetAllUsersQuery } from "@/redux/features/admin/admin.api";
import { AdminUser, UsersFiltersState } from "@/types/admin.types";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const defaultFilters: UsersFiltersState = {
  searchTerm: "",
  role: "",
  status: "",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function AllUsersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState<UsersFiltersState>(defaultFilters);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  // Build query params from filters
  const queryParams = {
    page: currentPage,
    limit,
    ...(filters.searchTerm ? { searchTerm: filters.searchTerm } : {}),
    ...(filters.role ? { role: filters.role } : {}),
    ...(filters.status ? { status: filters.status } : {}),
  };

  const { data, isLoading } = useGetAllUsersQuery(queryParams);

  const users: AdminUser[] = data?.data ?? [];
  const totalPages: number = data?.meta?.totalPages ?? 1;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleFilterChange = (updated: Partial<UsersFiltersState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
    setCurrentPage(1); // reset to page 1 on filter change
  };

  const handleReset = () => {
    setFilters(defaultFilters);
    setCurrentPage(1);
  };

  const handleOpenModal = (user: AdminUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="w-full max-w-7xl mx-auto px-5 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">All Users</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage and monitor all registered accounts.
          </p>
        </div>
        {data?.meta?.total !== undefined && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {data.meta.total}
            </span>{" "}
            total users
          </div>
        )}
      </div>

      {/* Filters */}
      <UsersFilters
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleReset}
      />

      {/* Table */}
      {isLoading ? (
        <div className="rounded-md border border-border overflow-hidden animate-pulse">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="w-8">#</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <div className="h-4 w-4 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-muted" />
                      <div className="h-4 w-24 bg-muted rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-32 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-16 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-5 w-16 bg-muted rounded" />
                  </TableCell>
                  <TableCell>
                    <div className="h-4 w-24 bg-muted rounded" />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="h-8 w-20 bg-muted rounded ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <UsersTable data={users} onAction={handleOpenModal} />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-end">
          <ReusablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* User action modal */}
      <UserActionModal
        open={modalOpen}
        onClose={handleCloseModal}
        user={selectedUser}
      />
    </div>
  );
}
