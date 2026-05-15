import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAxiosSecure from "./useAxiosSecure";
import useAuth from "./useAuth";

const useRole = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const { data: role, isLoading } = useQuery({
    queryKey: ["role"],
    queryFn: async () => {
      const response = await axiosSecure.get(
        `/users-role?email=${user?.email}`
      );
      return response.data;
    },
  });
    
    // console.log(role,isLoading)

  return { role, isLoading };
};

export default useRole;
