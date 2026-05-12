import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./routes/route.jsx";
import AuthProvider from "./providers/AuthProvider/AuthProvider.jsx";
import { Toaster } from "sonner";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router}></RouterProvider>
    <Toaster
      position="top-center"
      richColors
      expand={true}
      invert={false}
      duration={5000}
    />
  </AuthProvider>
);
