import TopNavbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNavbar />
      <main className="flex-1 min-h-[calc(100vh-60px)]">{children}</main>
    </div>
  );
}
