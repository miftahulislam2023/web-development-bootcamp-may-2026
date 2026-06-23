import { baseApi } from "@/redux/baseApi";
import { ICategory, IResponse } from "@/types";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/categories",
        method: "POST",
        data: categoryData,
      }),
      invalidatesTags: ["CATEGORY"],
    }),

    updateCategory: builder.mutation({
      query: ({ categoryId, categoryData }) => ({
        url: `/categories/${categoryId}`,
        method: "PATCH",
        data: categoryData,
      }),
      invalidatesTags: ["CATEGORY"],
    }),

    removeCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["CATEGORY"],
    }),

    getSingleCategory: builder.query({
      query: (categoryId) => ({
        url: `/categories/${categoryId}`,
        method: "GET",
      }),
      providesTags: ["CATEGORY"],
      transformResponse: (response: IResponse<unknown>) => response.data,
    }),

    getAllCategories: builder.query({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params,
      }),
      providesTags: ["CATEGORY"],
      transformResponse: (response: IResponse<ICategory>) => response,
    }),
  }),
});

export const {
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useRemoveCategoryMutation,
  useGetSingleCategoryQuery,
  useGetAllCategoriesQuery,
} = categoryApi;