import { useQuery } from "@tanstack/react-query";

import useAxiosSecure from "./useAxiosSecure";

const useDashboardData = () => {

  const axiosSecure = useAxiosSecure();

  const {
    data: dashboardData = {},
    isLoading,
    error,
    refetch,
  } = useQuery({

    queryKey: ["dashboard-data"],

    queryFn: async () => {

      const res =
        await axiosSecure.get("/dashboard-data");

      return res.data;
    },
  });

  return {
    dashboardData,
    isLoading,
    error,
    refetch,
  };
};

export default useDashboardData;