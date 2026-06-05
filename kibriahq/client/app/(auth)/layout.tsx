"use client";

import useCheckAuth from "@/hooks/useCheckAuth";

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { rehydrated, isAuth } = useCheckAuth();

    if (!rehydrated || !isAuth) {
        return null;
    }

    return children;
};

export default Layout;