import {api} from "./api"


interface GetExpensesParams {
  page: number
  limit: number
  month: number
  year: number
  search: string
}

export const getExpensesApi =
  async ({
    page,
    limit,
    month,
    year,
    search,
  }: GetExpensesParams) => {

    const response =
      await api.get("/expenses", {
        params: {
          page,
          limit,
          month,
          year,
          search,
        },
      })

    return response.data
  }

  export const deleteExpenseApi =
  async (id: string) => {

    const response =
      await api.delete(
        `/expenses/${id}`
      )

    return response.data
  }

  export const getSingleExpenseApi =
  async (id: string) => {

    const response =
      await api.get(
        `/expenses/${id}`
      )

    return response.data
  }

export const updateExpenseApi =
  async (
    id: string,
    data: {
      title?: string
      amount?: number
      note?: string
    }
  ) => {

    const response =
      await api.patch(
        `/expenses/${id}`,
        data
      )

    return response.data
  }

  export const createExpenseApi =
  async (data: {
    expenseType: string
    title: string
    amount: number
    note: string
  }) => {

    const response =
      await api.post(
        "/expenses",
        data
      )

    return response.data
  }