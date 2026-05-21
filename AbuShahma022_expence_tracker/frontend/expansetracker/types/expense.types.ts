export interface Expense {
  _id: string

  user: string

  title: string

  amount: number

  note: string

  expenseDate: string

  createdAt: string

  updatedAt: string

  expenseType: {
    _id: string
    name: string
  }
}

export interface ExpenseResponse {
  success: boolean

  currentPage: number

  totalPages: number

  totalExpenses: number

  data: Expense[]
}