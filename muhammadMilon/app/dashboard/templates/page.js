import { listMarketplaceTemplatesForUser } from "@/actions/marketplace";
import { TemplatesMarketplace } from "@/components/dashboard/TemplatesMarketplace";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Templates",
};

export default async function DashboardTemplatesPage() {
  const templates = await listMarketplaceTemplatesForUser();
  return <TemplatesMarketplace initialTemplates={templates} />;
}
