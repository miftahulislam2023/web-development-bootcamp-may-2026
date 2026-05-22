interface TransactionData {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  description: string | null;
  date: string;
  category: string;
  receiptUrl: string | null;
  isRecurring: boolean;
  recurringInterval: string | null;
  nextRecurringDate: string | null;
  lastProcessed: string | null;
  status: string;
  userId: string;
  accountId: string;
  createdAt: string;
  updatedAt: string;
}

interface GroupedData {
  date: string;
  income: number;
  expense: number;
}

export type { TransactionData, GroupedData };
