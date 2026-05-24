import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-[#071028]">

      <Navbar />

      <Outlet />

    </div>
  );
}