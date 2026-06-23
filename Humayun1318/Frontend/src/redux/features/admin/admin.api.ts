import { baseApi } from "@/redux/baseApi";

export const adminApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // =========================
    // Analytics
    // =========================
    getAdminAnalytics: builder.query({
      query: () => ({
        url: "/users/analytics",
        method: "GET",
      }),
      providesTags: ["ADMIN_ANALYTICS"],
    }),

    // =========================
    // Users List
    // =========================
    getAllUsers: builder.query({
      query: (params) => ({
        url: "/users",
        method: "GET",
        params, // { page, limit, search, role, status }
      }),
      providesTags: ["ADMIN_USERS"],
    }),

    updateUserStatus: builder.mutation({
      query: (body: {
        userId: string;
        status: "active" | "suspended" | "deleted";
      }) => ({
        url: `/users/${body.userId}/status`,
        method: "PATCH",
        data: { status: body.status },
      }),
      invalidatesTags: ["ADMIN_USERS", "ADMIN_ANALYTICS"],
    }),

    // =========================
    // Cron Jobs
    // =========================
    getCronJobInfo: builder.query({
      query: () => ({
        url: "/admin/cron/info",
        method: "GET",
      }),
      providesTags: ["ADMIN_CRON"],
    }),

    runCronJob: builder.mutation({
      query: () => ({
        url: "/recurrences/trigger",
        method: "POST",
      }),
      invalidatesTags: ["ADMIN_CRON", "ADMIN_ANALYTICS"],
    }),
  }),
});

export const {
  useGetAdminAnalyticsQuery,
  useGetAllUsersQuery,
  useUpdateUserStatusMutation,
  useGetCronJobInfoQuery,
  useRunCronJobMutation,
} = adminApi;