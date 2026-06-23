import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Settings2 } from "lucide-react";
import { AdminUser } from "@/types/admin.types";
import { getInitials } from "@/utils/getInitials";
import { statusStyles } from "@/utils/statusStyles";
import { formatDate } from "@/utils/formatDate";

const roleStyles: Record<string, string> = {
  admin: "border-primary/30 bg-primary/10 text-primary",
  user: "bg-secondary text-secondary-foreground",
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface UsersTableProps {
  data: AdminUser[];
  onAction: (user: AdminUser) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function UsersTable({ data, onAction }: UsersTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="rounded-md border border-muted py-16 flex items-center justify-center">
        <p className="text-sm text-muted-foreground">No users found.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border overflow-hidden">
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
          {data.map((user, index) => (
            <TableRow key={user._id}>
              {/* Index */}
              <TableCell className="text-sm text-muted-foreground">
                {index + 1}
              </TableCell>

              {/* Name + Avatar */}
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarImage
                      src={user.avatarUrl ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-medium text-sm whitespace-nowrap">
                    {user.name}
                  </span>
                </div>
              </TableCell>

              {/* Email */}
              <TableCell className="text-sm text-muted-foreground">
                {user.email}
              </TableCell>

              {/* Role */}
              <TableCell>
                <Badge
                  variant="outline"
                  className={`capitalize text-xs ${roleStyles[user.role] ?? ""}`}
                >
                  {user.role}
                </Badge>
              </TableCell>

              {/* Status */}
              <TableCell>
                <Badge
                  variant="outline"
                  className={`capitalize text-xs ${statusStyles[user.status] ?? ""}`}
                >
                  {user.status}
                </Badge>
              </TableCell>

              {/* Joined */}
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(user.createdAt)}
              </TableCell>

              {/* Action */}
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 gap-1.5"
                  onClick={() => onAction(user)}
                >
                  <Settings2 className="h-3.5 w-3.5" />
                  Manage
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
