import { baseApi } from "@/redux/baseApi";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation({
      query: (userInfo) => ({
        url: "/users/update-profile",
        method: "PATCH",
        data: userInfo,
      }),
      invalidatesTags: ["USER"],
    }),

    changePassword: builder.mutation({
      query: (passwordInfo) => ({
        url: "/users/change-password",
        method: "PATCH",
        data: passwordInfo,
      }),
    }),

    setPassword: builder.mutation({
      query: (passwordInfo) => ({
        url: "/auth/set-password",
        method: "POST",
        data: passwordInfo,
      }),
      invalidatesTags: ["USER"],
    }),

    deleteAccount: builder.mutation({
      query: (password) => ({
        url: "/users/delete-account",
        method: "DELETE",
        data: password,
      }),
      invalidatesTags: ["USER"],
    }),
  }),
});

export const {
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useSetPasswordMutation,
  useDeleteAccountMutation,
} = userApi;