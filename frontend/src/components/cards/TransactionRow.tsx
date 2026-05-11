// src/components/cards/TransactionRow.tsx
import { format } from "date-fns";
import { ArrowDownRight, ArrowUpLeft, ArrowRightLeft } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";

interface TransactionRowProps {
  id: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  category: string;
  date: string;
  description?: string;
  currency?: string;
}

export default function TransactionRow({
  id,
  type,
  amount,
  category,
  date,
  description,
  currency = "$",
}: TransactionRowProps) {
  const typeConfig = {
    income: {
      icon: ArrowDownRight,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    expense: { icon: ArrowUpLeft, color: "text-red-500", bg: "bg-red-50" },
    transfer: {
      icon: ArrowRightLeft,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  return (
    <TableRow>
      <TableCell>
        <div
          className={`w-10 h-10 rounded-full ${config.bg} flex items-center justify-center`}
        >
          <Icon className={config.color} size={20} />
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium capitalize">{category}</p>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <p className="font-medium">{format(new Date(date), "MMM d, yyyy")}</p>
        <p className="text-sm text-muted-foreground capitalize">{type}</p>
      </TableCell>
      <TableCell className="text-right">
        <p
          className={`font-semibold ${type === "income" ? "text-green-500" : "text-red-500"}`}
        >
          {type === "income" ? "+" : "-"}
          {currency}
          {amount.toFixed(2)}
        </p>
      </TableCell>
    </TableRow>
  );
}
