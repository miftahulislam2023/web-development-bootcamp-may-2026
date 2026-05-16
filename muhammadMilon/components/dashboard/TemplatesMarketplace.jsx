"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Lock, Sparkles } from "lucide-react";
import { createProjectFromTemplate } from "@/actions/projects";
import { duplicateTemplateAsProject } from "@/actions/templates-user";
import { createTemplateCheckout } from "@/actions/billing";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { DownloadTemplateButton } from "@/components/dashboard/DownloadTemplateButton";

export function TemplatesMarketplace({ initialTemplates }) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(() => {
    const fromDb = [
      ...new Set(
        initialTemplates
          .map((t) => (t.category || "").toLowerCase().trim())
          .filter((c) => c && c !== "all"),
      ),
    ].sort();
    return ["all", ...fromDb];
  }, [initialTemplates]);

  const filtered = useMemo(() => {
    return initialTemplates.filter((t) => {
      const cat = (t.category || "").toLowerCase();
      const matchesCat =
        activeCategory === "all" || cat === activeCategory || cat.includes(activeCategory);
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [initialTemplates, activeCategory, searchQuery]);

  async function useTemplate(id) {
    startTransition(async () => {
      toast.loading("Creating project…", { id: "tpl" });
      const res = await createProjectFromTemplate(id);
      if (res.ok) {
        toast.success("Project created", { id: "tpl" });
        router.push(`/dashboard/projects/${res.project.slug}/builder`);
        router.refresh();
      } else {
        toast.error(res.error || "Failed", { id: "tpl" });
      }
    });
  }

  async function duplicateTemplate(id) {
    startTransition(async () => {
      const res = await duplicateTemplateAsProject(id);
      if (res.ok) {
        toast.success("Duplicate project created");
        router.push(`/dashboard/projects/${res.project.slug}/builder`);
        router.refresh();
      } else {
        toast.error(res.error || "Duplicate failed");
      }
    });
  }

  async function buyTemplate(id) {
    startTransition(async () => {
      const res = await createTemplateCheckout(id);
      if (res.ok && res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res.error || "Checkout failed");
      }
    });
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-1">
            <h1 className="font-display text-3xl font-bold tracking-tight">Template marketplace</h1>
            <p className="text-sm text-[var(--muted-foreground)]">
              Free and premium layouts from the database — unlock premium with Stripe.
            </p>
          </div>
          <div className="relative w-full md:w-72">
            <input
              type="search"
              placeholder="Search…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-2 pl-10 pr-4 text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500"
            />
            <svg
              className="absolute left-3 top-2.5 h-4 w-4 text-[var(--muted-foreground)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4 py-2 text-xs font-semibold capitalize transition-all ${
              activeCategory === cat
                ? "bg-[var(--accent)] text-white shadow-md shadow-indigo-500/20"
                : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-indigo-500/30"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((template) => {
          const locked = template.isPremium && template.priceCents > 0 && !template.owned;
          const canDownloadZip = !locked;
          return (
            <Card
              key={template.id}
              className="flex flex-col overflow-hidden border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-lg"
            >
              <div
                className="relative h-40 bg-gradient-to-br from-indigo-600/30 to-violet-600/30"
                style={
                  template.thumbnail
                    ? {
                        backgroundImage: `url(${template.thumbnail})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                {locked ? (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur">
                    <Lock className="size-3" /> Premium
                  </span>
                ) : template.isPremium ? (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                    <Sparkles className="size-3" /> Owned
                  </span>
                ) : (
                  <span className="absolute right-2 top-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur">
                    Free
                  </span>
                )}
              </div>
              <CardContent className="flex flex-1 flex-col gap-3 p-4">
                <div>
                  <h3 className="font-display text-lg font-semibold">{template.name}</h3>
                  <p className="line-clamp-2 text-xs text-[var(--muted-foreground)]">
                    {template.description || "—"}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-wide text-[var(--muted-foreground)]">
                    {template.category || "general"}
                  </p>
                </div>
                <div className="mt-auto flex flex-wrap gap-2">
          {locked ? (
            <Button
              type="button"
              className="flex-1"
              disabled={isPending}
              onClick={() => buyTemplate(template.id)}
            >
              Buy ${(template.priceCents / 100).toFixed(2)}
            </Button>
          ) : (
            <>
              <Button
                type="button"
                className="flex-1"
                disabled={isPending}
                onClick={() => useTemplate(template.id)}
              >
                Use template
              </Button>
              <Button
                type="button"
                variant="secondary"
                disabled={isPending}
                onClick={() => duplicateTemplate(template.id)}
              >
                Duplicate
              </Button>
              {canDownloadZip ? (
                <DownloadTemplateButton
                  templateId={template.id}
                  templateSlug={template.slug}
                  label="Download ZIP"
                />
              ) : null}
            </>
          )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="text-center text-sm text-[var(--muted-foreground)]">No templates match filters.</p>
      ) : null}
    </div>
  );
}
