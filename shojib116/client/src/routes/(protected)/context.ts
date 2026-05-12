import { createContext } from "svelte";

interface User {
  username: string;
}

export const [getUsersContext, setUsersContext] = createContext<User[]>();
