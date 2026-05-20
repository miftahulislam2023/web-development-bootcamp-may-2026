import { createContext, useContext, useState } from "react";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  /**
   * login — accepts any email + password (demo).
   * Derives a display name from the email prefix.
   */
  function login(email, password) {
    if (!email || !password) throw new Error("Fill all fields");
    const parts = email.split("@")[0].split(/[._-]/);
    const name  = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ");
    setUser({ name, email });
  }

  /**
   * register — accepts name + email + password (demo).
   */
  function register(name, email, password) {
    if (!name || !email || !password) throw new Error("Fill all fields");
    setUser({ name, email });
  }

  function logout() { setUser(null); }

  return (
    <AuthCtx.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

export const useAuth = () => useContext(AuthCtx);