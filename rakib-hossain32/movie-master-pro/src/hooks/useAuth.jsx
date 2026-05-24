import React from "react";
import { use } from "react";
import AuthContext from "../context/AuthContext";

const useAuth = () => {
  const info = use(AuthContext);
  return info;
};

export default useAuth;
