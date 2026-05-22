"use client";

import { useMemo } from "react";
import { Provider } from "react-redux";
import { makeStore } from "@/redux/store";

export function StoreProvider({ children }) {
  const store = useMemo(() => makeStore(), []);
  return <Provider store={store}>{children}</Provider>;
}
