import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth } from "../../firebase/firebase.init.js";
import { fetchUserData } from "../../utils/fetchUserData/fetchUserData.js";

export const AuthContext = createContext();

const googleProvider = new GoogleAuthProvider();

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

    // Google Authentication

    const signInWithGoogle = async () =>{
        try {
            return await signInWithPopup(auth, googleProvider);
        } catch (error) {
            if (error.code === "auth/popup-closed-by-user") {
                setLoading(false);
                return null;
            }
            setLoading(false);
            throw error;
        }
    };

    // Update profile

    const updateUser = (updatedData) => {
        return updateProfile(auth.currentUser, updatedData);
    }

    // Password Reset

    const passwordReset = (email) => {
        return sendPasswordResetEmail(auth, email);
    };

    // Users Data

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            if (!currentUser) {
                setUserData(null);
                setToken(null);
                localStorage.removeItem("access-token");
                setLoading(false);
                return;
            }

            if (currentUser) {
                const idToken = await currentUser.getIdToken();
                setToken(idToken);
                localStorage.setItem("access-token", idToken);
                const res = await fetchUserData(currentUser);
                setUserData(res);
            }
            else {
                setUserData(null);
                setToken(null);
                localStorage.removeItem("access-token");
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const authData={
        register,
        login,
        logout,
        signInWithGoogle,
        updateUser,
        passwordReset,
        user,
        setUser,
        userData,
        setUserData,
        token,
        loading,
        setLoading
    };

    return <AuthContext value={authData}>{children}</AuthContext>
};

export default AuthProvider;