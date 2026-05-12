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
};

export default function TransactionRow({
  type,
  amount,
  category,
  date,
  description,
  currency = "$",
}: Props) {
  const normalizedAmount = Number(amount);
  const config = {
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
  }[type];
  const Icon = config.icon;
  const categoryLabel =
    typeof category === "string" ? category : category?.name || "Uncategorized";

  return (
    <>
      <TableCell>
        <div
          className={
            "flex h-10 w-10 items-center justify-center rounded-full " +
            config.bg
          }
        >
          <Icon className={config.color} size={18} />
        </div>
      </TableCell>
      <TableCell>
        <div>
          <p className="font-medium capitalize">{categoryLabel}</p>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <p className="font-medium">{format(new Date(date), "MMM d, yyyy")}</p>
        <p className="text-sm text-muted-foreground capitalize">{type}</p>
      </TableCell>
      <TableCell className="text-right font-semibold">
        {type === "income" ? "+" : "-"}
        {currency}
        {Number.isFinite(normalizedAmount)
          ? normalizedAmount.toFixed(2)
          : "0.00"}
      </TableCell>
    </>
  );
}
