import { format } from "date-fns";
import { ArrowDownRight, ArrowRightLeft, ArrowUpLeft } from "lucide-react";
import { TableCell } from "@/components/ui/table";

type Props = {
  id: string;
  type: "income" | "expense" | "transfer";
  amount: number;
  category:
    | string
    | {
        name?: string;
      }
    | null
    | undefined;
  date: string;
  description?: string;
  currency?: string;
  showCategory?: boolean;
};

export default function TransactionRow({
  type,
  amount,
  category,
  date,
  description,
  currency = "$",
  showCategory = true,
}: Props) {
  const normalizedAmount = Number(amount);

  const config = {
    income: {
      icon: ArrowDownRight,
      color: "text-emerald-600",
      bg: "bg-emerald-100",
      amountColor: "text-emerald-600",
      label: "Income",
    },
    expense: {
      icon: ArrowUpLeft,
      color: "text-rose-600",
      bg: "bg-rose-100",
      amountColor: "text-rose-600",
      label: "Expense",
    },
    transfer: {
      icon: ArrowRightLeft,
      color: "text-blue-600",
      bg: "bg-blue-100",
      amountColor: "text-blue-600",
      label: "Transfer",
    },
  }[type];

  const Icon = config.icon;

  const categoryLabel =
    typeof category === "string" ? category : category?.name || "Others";

  return (
    <>
      {showCategory && (
        <>
          {/* Icon */}
          <TableCell className="border-r border-border px-5 py-5 text-center align-middle">
            <div className="flex justify-center">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl shadow-sm ${config.bg}`}
              >
                <Icon className={config.color} size={20} />
              </div>
            </div>
          </TableCell>

          {/* Category & Description */}
          <TableCell className="border-r border-border px-5 py-5 text-center align-middle">
            <div className="flex flex-col items-center justify-center space-y-1">
              <p className="font-semibold text-sm text-foreground capitalize">
                {categoryLabel}
              </p>

              <p className="text-sm text-muted-foreground max-w-[200px] truncate">
                {description || "No description"}
              </p>
            </div>
          </TableCell>
        </>
      )}

      {/* Date & Type */}
      <TableCell className="border-r border-border px-5 py-5 text-center align-middle">
        <div className="flex flex-col items-center justify-center space-y-2">
          <p className="font-medium text-sm text-foreground">
            {format(new Date(date), "MMM d, yyyy")}
          </p>

          <span
            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.color}`}
          >
            {config.label}
          </span>
        </div>
      </TableCell>

      {/* Amount */}
      <TableCell className="border-r border-border px-5 py-5 text-center align-middle">
        <p className={`text-lg font-bold tracking-tight ${config.amountColor}`}>
          {type === "income" ? "+" : "-"}
          {currency}
          {Number.isFinite(normalizedAmount)
            ? normalizedAmount.toFixed(2)
            : "0.00"}
        </p>
      </TableCell>
    </>
  );
}
