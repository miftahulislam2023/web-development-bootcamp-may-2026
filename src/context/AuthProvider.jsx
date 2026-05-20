import React, { useEffect, useState } from 'react';
import { AuthContext } from '../AuthContext';
import { auth } from '../../firebase/firebase.init'
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile } from 'firebase/auth';

const googleProvider = new GoogleAuthProvider()


const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
     const [theme, setTheme] = useState('light')


    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password)
    }

   const signInWithGoogle = async () => {
    setLoading(true);
    try {
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
        return result;
    } catch (error) {
        console.error("Google Sign-in error:", error);
        alert(error.message); // or show custom toast
        return null;
    } finally {
        setLoading(false);
    }
};


    const updateUserProfile=profileInfo=>{
        return updateProfile(auth.currentUser,profileInfo)

    }

    const logOutUser = () => {
        setLoading(true)
        return signOut(auth)
    }


    useEffect(() => {
        const unSubscribe = onAuthStateChanged(auth, currentUser => {
            setUser(currentUser)
            setLoading(false)
        })
        return () => {
            unSubscribe()
        }
    }, [])

    const authInfo = {
        createUser,
        signIn,
        updateUserProfile,
        logOutUser,
        user,
        setUser,
        loading,
        setLoading,
        signInWithGoogle,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        theme,
        setTheme
    }
    

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;