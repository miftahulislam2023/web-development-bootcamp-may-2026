import { IUser } from "@/types";
import { createContext } from "react";

export interface IUserContext {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  clearUser: () => void;
}

export const UserContext =
  createContext<IUserContext | null>(null);