interface EmailData {
  stats?: {
    totalExpenses: number;
    totalIncome: number;
    byCategory: Record<string, number>;
    transactionCount: number;
  };
  month?: string;
  insights?: string[];
  percentageUsed?: number;
  budgetAmount?: string;
  totalExpenses?: string;
  accountName?: string;
}

interface EmailTemplateProps {
  userName: string;
  type: "monthly-report" | "budget-alert";
  data: EmailData;
}

export type { EmailData, EmailTemplateProps };
