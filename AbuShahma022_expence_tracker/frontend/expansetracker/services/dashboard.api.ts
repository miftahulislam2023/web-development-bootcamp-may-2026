import {api }from "./api"

export const getExpenseSummaryApi =
  async () => {
    const response =
      await api.get(
        "/expenses/summary"
      )

    return response.data
  }

  export const getBudgetStatusApi =
  async () => {
    const currentDate = new Date()

    const month =
      currentDate.getMonth() + 1

    const year =
      currentDate.getFullYear()

    const response =
      await api.get(
        `/budgets/current?month=${month}&year=${year}`
      )

    return response.data
  }


  export const getMonthlySummaryApi =
  async () => {

    const response =
      await api.get(
        "/expenses/monthly-summary"
      )

    return response.data
  }

export const getCategorySummaryApi =
  async () => {

    const response =
      await api.get(
        "/expenses/category-summary"
      )

    return response.data
  }