import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";

export default function DashboardLayout() {

  return (
    <div className="flex bg-[#071028] min-h-screen">

      <Sidebar />

      <main className="flex-1 p-8 text-white">

        <Outlet />

      </main>

    </div>
  );
}