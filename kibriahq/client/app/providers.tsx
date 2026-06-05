"use client";

import { StoreProvider } from "easy-peasy";
import store from "@/store";

export default function Providers({ children }: { children: React.ReactNode }) {
    return <StoreProvider store={store}>{children}</StoreProvider>;
}