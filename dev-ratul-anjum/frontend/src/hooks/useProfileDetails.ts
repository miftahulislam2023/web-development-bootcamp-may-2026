import { useQuery } from "@tanstack/react-query";

const useProfileDetails = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/user/v1/profile`,
        {
          credentials: "include",
        },
      );
      const result = await res.json();

      return result?.data;
    },
    staleTime: Infinity,
  });
};

export default useProfileDetails;
