import {api} from "./api"

export const createCategoryApi =
  async (data: {
    name: string
  }) => {

    const response =
      await api.post(
        "/expense-types",
        data
      )

    return response.data
  }

  export const getCategoriesApi =
  async () => {

    const response =
      await api.get(
        "/expense-types"
      )

    return response.data
  }