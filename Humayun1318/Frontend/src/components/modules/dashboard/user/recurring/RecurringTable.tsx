// components/modules/dashboard/user/recurring/RecurringTable.tsx
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { IRecurrence } from "@/types";

interface RecurringTableProps {
  data: IRecurrence[];
  onEdit: (recurring: IRecurrence) => void;
  onDelete: (recurring: IRecurrence) => void;
}

export function RecurringTable({ data, onEdit, onDelete }: RecurringTableProps) {
  // Helper function to format currency
  const formatCurrency = (amount: number, currency: string = "USD") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get frequency label
  const getFrequencyLabel = (frequency: string) => {
    const labels: Record<string, string> = {
      daily: "Daily",
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
    };
    return labels[frequency] || frequency;
  };

  // Helper function to get payment method label
  const getPaymentMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      cash: "Cash",
      card: "Card",
      bank_transfer: "Bank Transfer",
      mobile_banking: "Mobile Banking",
      other: "Other",
    };
    return labels[method] || method;
  };

  return (
    <div className="border border-muted rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/40">
            <TableHead className="w-8">#</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Next Due Date</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-16">
                <p className="text-muted-foreground text-sm">
                  No recurring transactions found.
                </p>
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, index) => (
              <TableRow key={item._id}>
                {/* Serial */}
                <TableCell className="text-muted-foreground text-sm">
                  {index + 1}
                </TableCell>

                {/* Description */}
                <TableCell className="font-medium">
                  {item.description ? (
                    <span>{item.description}</span>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>

                {/* Category with Type Badge */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{(item.categoryId as any).name}</span>
                    <Badge
                      variant={item.type === "income" ? "default" : "secondary"}
                      className={
                        item.type === "income"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-100 w-fit"
                          : "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-100 w-fit"
                      }
                    >
                      {item.type === "income" ? "Income" : "Expense"}
                    </Badge>
                  </div>
                </TableCell>

                {/* Amount */}
                <TableCell>
                  <span
                    className={`font-semibold ${
                      item.type === "income"
                        ? "text-emerald-600"
                        : "text-rose-600"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}{" "}
                    {formatCurrency(item.amount, item.currency)}
                  </span>
                </TableCell>

                {/* Frequency */}
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {getFrequencyLabel(item.frequency)}
                    {item.interval > 1 && ` (Every ${item.interval})`}
                  </Badge>
                </TableCell>

                {/* Next Due Date */}
                <TableCell className="whitespace-nowrap">
                  {formatDate(item.nextDueDate)}
                </TableCell>

                {/* Payment Method */}
                <TableCell>
                  {item.paymentMethod ? (
                    <Badge variant="secondary" className="text-xs">
                      {getPaymentMethodLabel(item.paymentMethod)}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Badge
                      className={
                        item.isActive
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                      }
                    >
                      {item.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {item.endDate && new Date(item.endDate) < new Date() && (
                      <Badge className="bg-red-100 text-red-700">
                        Expired
                      </Badge>
                    )}
                  </div>
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit recurring transaction"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete recurring transaction"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}