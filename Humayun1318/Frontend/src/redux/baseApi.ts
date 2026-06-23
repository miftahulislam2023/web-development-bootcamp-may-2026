import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "./axiosBaseQuery";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: axiosBaseQuery(),
  //   baseQuery: fetchBaseQuery({
  //     baseUrl: config.baseUrl,
  //     credentials: "include",
  //   }),
  tagTypes: ["USER", "CATEGORY", "TRANSACTION", "SUMMARY", "RECURRING", "ADMIN_USERS", "ADMIN_CRON", "ADMIN_ANALYTICS"],
  endpoints: () => ({}),
});
