import { auth } from "@/lib/auth";
import { listPublicTemplates } from "@/actions/marketplace";
import TemplatesClient from "./TemplatesClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Templates | Nexora Studio",
  description: "Browse starter templates from the Nexora Studio marketplace.",
};

export default async function TemplatesPage() {
  const [session, templates] = await Promise.all([auth(), listPublicTemplates()]);
  return <TemplatesClient session={session} templates={templates} />;
}
