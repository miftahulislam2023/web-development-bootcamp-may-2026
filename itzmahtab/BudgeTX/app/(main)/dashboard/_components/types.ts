interface Account {
  id: string;
  name: string;
  isDefault: boolean;
}

interface Transaction {
  id: string;
  accountId: string;
  type: "INCOME" | "EXPENSE";
  description: string | null;
  date: Date;
  amount: number;
  category: string;
}

type Budget = {
  amount: number;
};

type BudgetProgressProps = {
  initialBudget: Budget | null;
  currentExpenses: number;
};

interface AccountData {
  id: string;
  name: string;
  type: "CURRENT" | "SAVINGS";
  balance: number;
  isDefault: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    transactions: number;
  };
}

export type { Account, Transaction, Budget, BudgetProgressProps, AccountData };
