import React from "react";
import useAxiosSecure from "./useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const useTransactionData = ({searchText, filterType}) => {
  const axiosSecure = useAxiosSecure();
  const { data: transactionData = [], refetch } = useQuery({
    queryKey: ["transactions", searchText, filterType],
    queryFn: async () => {
      const res = await axiosSecure.get(`/transactions?searchText=${searchText}&filterType=${filterType}`);
      return res.data;
    },
  });
  return {
    transactionData,
    refetch,
  };
};

export default useTransactionData;
