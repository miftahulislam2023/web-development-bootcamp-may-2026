import { baseApi } from "@/redux/baseApi";
import { IRecurrence, IResponse } from "@/types";

export const recurringApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addRecurringTransaction: builder.mutation({
      query: (recurringData) => ({
        url: "/recurrences",
        method: "POST",
        data: recurringData,
      }),
      invalidatesTags: ["RECURRING"],
    }),

    updateRecurringTransaction: builder.mutation({
      query: ({ recurringId, recurringData }) => ({
        url: `/recurrences/${recurringId}`,
        method: "PATCH",
        data: recurringData,
      }),
      invalidatesTags: ["RECURRING"],
    }),

    removeRecurringTransaction: builder.mutation({
      query: (recurringId) => ({
        url: `/recurrences/${recurringId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["RECURRING"],
    }),

    getSingleRecurringTransaction: builder.query({
      query: (recurringId) => ({
        url: `/recurrences/${recurringId}`,
        method: "GET",
      }),
      providesTags: ["RECURRING"],
      transformResponse: (response: IResponse<IRecurrence>) => response.data,
    }),

    getAllRecurringTransactions: builder.query({
      query: (params) => ({
        url: "/recurrences",
        method: "GET",
        params,
      }),
      providesTags: ["RECURRING"],
      transformResponse: (response: IResponse<IRecurrence[]>) => response,
    }),
  }),
});

export const {
  useAddRecurringTransactionMutation,
  useUpdateRecurringTransactionMutation,
  useRemoveRecurringTransactionMutation,
  useGetSingleRecurringTransactionQuery,
  useGetAllRecurringTransactionsQuery,
} = recurringApi;