import DashboardNavbar from "./dashboard-navbar";
import DashboardOverview from "./dashboard-overview";
import { IDashboardProps } from "@/interfaces/interfaces";

export default async function Dashboard({ searchParams }: IDashboardProps) { 
  return (
    <div className="w-full md:px-6">
      <DashboardNavbar />
      <DashboardOverview searchParams={searchParams} /> 
    </div>
  );
}
