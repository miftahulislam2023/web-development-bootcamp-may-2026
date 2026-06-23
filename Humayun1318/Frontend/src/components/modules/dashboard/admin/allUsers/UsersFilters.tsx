import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { UsersFiltersState } from "@/types/admin.types";

interface UsersFiltersProps {
  filters: UsersFiltersState;
  onChange: (updated: Partial<UsersFiltersState>) => void;
  onReset: () => void;
}

const ALL = "__all__";

export function UsersFilters({ filters, onChange, onReset }: UsersFiltersProps) {
  const hasActive = filters.searchTerm || filters.role || filters.status;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <Input
        placeholder="Search by name or email…"
        value={filters.searchTerm}
        onChange={(e) => onChange({ searchTerm: e.target.value })}
        className="h-9 w-72"
      />

      {/* Role filter */}
      <Select
        value={filters.role || ALL}
        onValueChange={(val) =>
          onChange({ role: val === ALL ? "" : (val as any) })
        }
      >
        <SelectTrigger className="h-9 w-36">
          <SelectValue placeholder="All Roles" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Roles</SelectItem>
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="user">User</SelectItem>
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select
        value={filters.status || ALL}
        onValueChange={(val) =>
          onChange({ status: val === ALL ? "" : (val as any) })
        }
      >
        <SelectTrigger className="h-9 w-40">
          <SelectValue placeholder="All Statuses" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All Statuses</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="suspended">Suspended</SelectItem>
          <SelectItem value="banned">Banned</SelectItem>
        </SelectContent>
      </Select>

      {/* Reset */}
      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <X className="h-3.5 w-3.5" />
          Reset
        </Button>
      )}
    </div>
  );
}