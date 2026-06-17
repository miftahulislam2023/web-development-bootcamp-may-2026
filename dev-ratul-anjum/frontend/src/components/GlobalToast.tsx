"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GlobalToast() {
  return (
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnFocusLoss
      draggable
      pauseOnHover
      className="text-sm"
      toastClassName="rounded-lg shadow-lg px-4 py-2"
      progressClassName="bg-white/70"
    />
  );
}
