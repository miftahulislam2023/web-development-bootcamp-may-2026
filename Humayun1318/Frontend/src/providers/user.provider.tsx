import { UserContext } from "@/context/user.context";
import { authApi, useUserInfoQuery } from "@/redux/features/auth/auth.api";
import { useAppDispatch } from "@/redux/hook";
import { IUser } from "@/types";
import { ReactNode, useCallback, useEffect, useState } from "react";

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { data, isLoading, error, refetch } = useUserInfoQuery(undefined);
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (data?.data) {
      setUser(data.data);
    }
  }, [data]);

  const clearUser = useCallback(() => {
    setUser(null);
    dispatch(authApi.util.resetApiState());
  }, []);

  const errorMessage = (error as any)?.data?.message || null;

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error: errorMessage,
        refetch,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
