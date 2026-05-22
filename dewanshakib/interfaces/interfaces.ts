import { ReactNode } from "react";

export interface ITransactionType {
  type: "income" | "expense";
}

export interface ITransactionRow {
  id: string;
  amount: number;
  description: string | null;
  category_name: string;
  type: string;
  created_at: Date;
}

export interface ITransactionsSearchParams {
  page?: string;
  limit?: string;
  orderBy?: string;
  orderDir?: string;
}

export interface ITransactionsPageProps {
  searchParams: Promise<ITransactionsSearchParams>;
}

export interface ITransactionTotals {
  income: number;
  expense: number;
}

export interface ICreateTransactionInput {
  amount: number;
  description?: string;
  category_icon: string;
  category_name: string;
  type: "income" | "expense";
  date: Date;
}

export interface ICreateTransactionActionResult {
  status: "success" | "error";
  message?: string;
}

export interface IDeleteTransactionActionResult {
  status: "success" | "error";
  message?: string;
}

export interface ITransactionsTableProps {
  transactions: ITransactionRow[];
  limit: number;
}

export interface IDashboardSearchParams {
  month?:string;
}

export interface IDashboardProps {
  searchParams: Promise<IDashboardSearchParams>;
}

export interface IDashboardOverviewProps {
  searchParams: Promise<IDashboardSearchParams>;
}

export interface IDateRange {
  from?: Date;
  to?: Date;
}

export interface ICreateTransactionModalProps extends ITransactionType {
  userId: string;
  modalTrigger: ReactNode;
}

export interface ITransactionsOrderByMap {
  [key: string]: "category_name" | "type" | "amount" | "created_at";
}

export interface ICategoriesOrderByMap {
  [key: string]: "name" | "type" | "created_at";
}

export interface ITransactionTotalsWhere {
  userId: string;
  created_at?: {
    gte?: Date;
    lte?: Date;
  };
}

export interface ISidebarContextProps {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
}

export interface ICategoryRow {
  id: string;
  userId: string;
  name: string;
  type: string;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateCategoryInput {
  name: string;
  type: "income" | "expense";
}

export interface IUpdateCategoryInput extends ICreateCategoryInput {
  id: string;
}

export interface ICategoryActionResult {
  status: "success" | "error";
  message?: string;
}

export interface IManageCategoriesProps {
  categories: ICategoryRow[];
  pagination: {
    totalPages: number;
    currentPage: number;
  };
  sortParams?: string;
}
