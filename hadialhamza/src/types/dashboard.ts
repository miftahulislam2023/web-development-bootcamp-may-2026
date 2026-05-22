export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: "income" | "expense" | "both";
}

export interface Transaction {
  _id: string;
  name: string;
  amount: number;
  type: "income" | "expense";
  date: string;
  note?: string;
  categoryId: Category;
  userId: string;
  createdAt: string;
  updatedAt: string;
}
