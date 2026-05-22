"use client";

import { createContext, useContext } from "react";

const BuilderViewportContext = createContext("desktop");

export function BuilderViewportProvider({ viewport, children }) {
  return (
    <BuilderViewportContext.Provider value={viewport}>
      {children}
    </BuilderViewportContext.Provider>
  );
}

export function useBuilderViewport() {
  return useContext(BuilderViewportContext);
}
