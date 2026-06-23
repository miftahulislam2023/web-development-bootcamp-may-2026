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
import { ITransaction } from "@/types";
import { Badge } from "@/components/ui/badge";

interface TransactionTableProps {
  data: ITransaction[];
  onEdit: (transaction: ITransaction) => void;
  onDelete: (transaction: ITransaction) => void;
}

export function TransactionTable({ data, onEdit, onDelete }: TransactionTableProps) {
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
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {!data || data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-16">
                <p className="text-muted-foreground text-sm">
                  No transactions found.
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

                {/* Date */}
                <TableCell className="font-medium whitespace-nowrap">
                  {formatDate(item.date)}
                </TableCell>

                {/* Category with Type Badge */}
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">{item.categoryName}</span>
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

                {/* Description */}
                <TableCell>
                  {item.description ? (
                    <div className="flex flex-col gap-1">
                      <span className="text-sm">{item.description}</span>
                      {item.referenceNote && (
                        <span className="text-xs text-muted-foreground">
                          Ref: {item.referenceNote}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
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

                {/* Payment Method */}
                <TableCell>
                  <Badge variant="outline" className="text-xs">
                    {getPaymentMethodLabel(item.paymentMethod)}
                  </Badge>
                </TableCell>

                {/* Tags */}
                <TableCell>
                  {item.tags && item.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {item.tags.slice(0, 2).map((tag, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs bg-gray-100 text-gray-700"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={() => onEdit(item)}
                      title="Edit transaction"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(item)}
                      title="Delete transaction"
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