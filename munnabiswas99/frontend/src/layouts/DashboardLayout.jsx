import React from "react";
import { Outlet } from "react-router";
import SideBar from "../components/dashboard/SideBar";

const DashboardLayout = () => {
  return (
    <div className="flex flex-col md:flex-row bg-gray-200 text-black w-11/12 mx-auto min-h-screen rounded my-4">

      <div className="w-full md:w-64">
        <SideBar />
      </div>

      <div className="flex-1 p-4 md:p-6 border-t border-l border-gray-300 my-10">
        <Outlet />
      </div>

    </div>
  );
};

export default DashboardLayout;