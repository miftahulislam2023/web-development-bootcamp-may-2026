import { Store } from "@/store";
import { isTokenExpired } from "@/utils/auth";
import { useStoreActions, useStoreState, useStoreRehydrated } from "easy-peasy";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const useCheckAuth = () => {
    const rehydrated = useStoreRehydrated();
    const { isAuth, token } = useStoreState((state: Store) => state.auth);
    const { logout } = useStoreActions((state: any) => state.auth);

    const router = useRouter();

    useEffect(() => {
        if (!rehydrated) return;

        if (!isAuth || isTokenExpired(token!)) {
            logout();
            router.replace("/login");
        }
    }, [rehydrated, isAuth, token]);

    return {
        rehydrated,
        isAuth
    }
}

export default useCheckAuth;