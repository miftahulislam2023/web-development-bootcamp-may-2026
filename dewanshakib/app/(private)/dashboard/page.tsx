import Dashboard from "@/components/pages/dashboard/dashboard";
import { IDashboardSearchParams } from "@/interfaces/interfaces";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<IDashboardSearchParams>;
}) {
  return <Dashboard searchParams={searchParams} />;
}
