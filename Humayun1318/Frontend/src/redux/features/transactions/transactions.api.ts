import { baseApi } from "@/redux/baseApi";
import { IResponse, ITransaction } from "@/types";

export const transactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTransaction: builder.mutation({
      query: (transactionData) => ({
        url: "/transactions",
        method: "POST",
        data: transactionData,
      }),
      invalidatesTags: ["TRANSACTION", "SUMMARY"],
    }),

    updateTransaction: builder.mutation({
      query: ({ transactionId, transactionData }) => ({
        url: `/transactions/${transactionId}`,
        method: "PATCH",
        data: transactionData,
      }),
      invalidatesTags: ["TRANSACTION", "SUMMARY"],
    }),

    removeTransaction: builder.mutation({
      query: (transactionId) => ({
        url: `/transactions/${transactionId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["TRANSACTION", "SUMMARY"],
    }),

    getSingleTransaction: builder.query({
      query: (transactionId) => ({
        url: `/transactions/${transactionId}`,
        method: "GET",
      }),
      providesTags: ["TRANSACTION"],
      transformResponse: (response: IResponse<ITransaction>) => response.data,
    }),

    getAllTransactions: builder.query({
      query: (params) => ({
        url: "/transactions",
        method: "GET",
        params,
      }),
      providesTags: ["TRANSACTION"],
      transformResponse: (response: IResponse<ITransaction[]>) => response,
    }),

    getTransactionSummary: builder.query({
      query: () => ({
        url: "/transactions/summary",
        method: "GET",
      }),
      providesTags: ["SUMMARY"],
      transformResponse: (response: IResponse<unknown>) => response.data,
    }),
  }),
});

export const {
  useAddTransactionMutation,
  useUpdateTransactionMutation,
  useRemoveTransactionMutation,
  useGetSingleTransactionQuery,
  useGetAllTransactionsQuery,
  useGetTransactionSummaryQuery,
} = transactionApi;