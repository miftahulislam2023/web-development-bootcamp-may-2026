interface Account {
  id: string;
  name: string;
  balance: number;
  isDefault: boolean;
}

interface Category {
  id: string;
  name: string;
  type: string;
}

interface TransactionData {
  type: "INCOME" | "EXPENSE";
  amount: number;
  description?: string | null;
  date: Date;
  accountId: string;
  category: string;
  isRecurring?: boolean;
  recurringInterval?: string | null;
}

export type { Account, Category, TransactionData };
