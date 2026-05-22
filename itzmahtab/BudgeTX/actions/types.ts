import type { ReactElement } from "react";

type TransactionData = {
  type: "EXPENSE" | "INCOME";
  amount: number;
  description?: string;
  date: Date;
  category: string;
  accountId: string;
  isRecurring?: boolean;
  recurringInterval?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
};

interface SendEmailParams {
  to: string;
  subject: string;
  react: ReactElement;
}

export type { TransactionData, SendEmailParams };
