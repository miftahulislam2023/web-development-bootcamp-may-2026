import {api} from "./api"

export const createBudgetApi =
  async (data: {
    amount: number
    month: number
    year: number
  }) => {

    const response =
      await api.post(
        "/budgets",
        data
      )

    return response.data
  }

export const getBudgetStatusApi =
  async (
    month: number,
    year: number
  ) => {

    const response =
      await api.get(
        "/budgets/current",
        {
          params: {
            month,
            year,
          },
        }
      )

    return response.data
  }