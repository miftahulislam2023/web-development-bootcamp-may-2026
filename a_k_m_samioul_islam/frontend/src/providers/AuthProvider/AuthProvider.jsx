import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase.init.js";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser]=useState(null);
    const [loading, setLoading]=useState(true);
    const [token, setToken] = useState(null);
    const [userData, setUserData] = useState(null);

    // Register

    const register= (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // Login

    const login= (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    // Logout

    const logout = () => {
        return signOut(auth);
    };

    

    const authData={
        register,
        login,
        logout
    };

    return <AuthContext value={authData}>{children}</AuthContext>
};

export default AuthProvider;