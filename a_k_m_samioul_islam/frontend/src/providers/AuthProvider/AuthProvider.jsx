import { createContext } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {

    const authData={

    };

    return <AuthContext value={authData}>{children}</AuthContext>
};

export default AuthProvider;