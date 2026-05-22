import { adminListTemplates } from "@/actions/admin";
import { AdminTemplatesList } from "@/components/admin/AdminTemplatesList";

export const metadata = {
  title: "Templates · Admin",
};

export default async function AdminTemplatesPage() {
  const templates = await adminListTemplates();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold">Templates</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          Delete catalog items or add rows via Prisma Studio / seed. Full editor UI can extend this page.
        </p>
      </div>
      <AdminTemplatesList templates={templates} />
    </div>
  );
}
