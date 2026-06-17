import React from 'react';
import useAxiosSecure from './useAxiosSecure';
import { useQuery } from '@tanstack/react-query';

const useWalletData = () => {
    const axiosSecure = useAxiosSecure();

    const {data: walletData = [], isLoading, error, refetch} = useQuery({
        queryKey: ["wallets"],
        queryFn: async()=>{
            const res = await axiosSecure.get("/wallets");
            return res.data
        }
    })

    return {
        walletData,
        isLoading,
        error,
        refetch
    }
};

export default useWalletData;