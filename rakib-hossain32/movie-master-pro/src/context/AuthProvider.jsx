import React, { useEffect } from "react";
import AuthContext from "./AuthContext";
import { useState } from "react";
import useAxiosSecure from "../hooks/useAxiosSecure";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const axiosSecure = useAxiosSecure();

  const [movies, setMovies] = useState([]);

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const updateUser = (displayName, photoURL) => {
    // setLoading(true);
    return updateProfile(auth.currentUser, {
      displayName,
      photoURL,
    });
  };

  const signOutUser = () => {
    setLoading(true);
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // console.log(currentUser)
      // if (currentUser) {
      //   const loggedUser = {
      //     email: currentUser.email,
      //     displayName: currentUser.displayName,
      //   };

        // axiosSecure.post("/users-create", loggedUser).then(() => {
        //   // console.log(data.data)
        // });
      // }
    });
    return () => unsubscribe();
  }, [axiosSecure]);

  // all movies get
  useEffect(() => {
    axiosSecure.get("/movies").then((data) => {
      setMovies(data.data);
    });
  }, [axiosSecure]);

  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const authInfo = {
    user,
    movies,
    loading,
    createUser,
    signInUser,
    loginGoogle,
    updateUser,
    signOutUser,

    showMobileMenu,
    setShowMobileMenu,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
