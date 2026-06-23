import { IUserContext, UserContext } from "@/context/user.context";
import { useContext } from "react";

export const useUser = (): IUserContext => {
  const context = useContext<IUserContext | null>(UserContext);

  if (!context) {
    throw new Error(
      "useUser must be used inside UserProvider"
    );
  }

  return context;
};