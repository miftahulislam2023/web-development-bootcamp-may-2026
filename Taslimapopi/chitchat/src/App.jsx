import { useEffect } from "react";
import { RouterProvider } from "react-router";

import { router } from "./router/routes";
import { useAuthStore } from "./store/useAuthStore";

import PageLoader from "./components/PageLoader";

function App() {
  const { checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return <PageLoader />;
  }

  return <RouterProvider router={router} />;
}

export default App;