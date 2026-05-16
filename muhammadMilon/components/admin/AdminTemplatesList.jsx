"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { adminDeleteTemplate } from "@/actions/admin";
import { Button } from "@/components/ui/Button";

export function AdminTemplatesList({ templates }) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="space-y-3">
      {templates.map((t) => (
        <div
          key={t.id}
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
        >
          <div>
            <p className="font-medium">{t.name}</p>
            <p className="text-xs text-[var(--muted-foreground)]">
              {t.slug} · {t.isPremium ? `Premium $${(t.priceCents / 100).toFixed(2)}` : "Free"} ·{" "}
              {t.category || "—"}
            </p>
          </div>
          <Button
            type="button"
            variant="danger"
            size="sm"
            disabled={pending}
            onClick={() =>
              start(async () => {
                await adminDeleteTemplate(t.id);
                router.refresh();
              })
            }
          >
            Delete
          </Button>
        </div>
      ))}
    </div>
  );
}
