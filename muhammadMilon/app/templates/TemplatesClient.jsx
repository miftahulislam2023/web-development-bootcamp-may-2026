"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { Button } from "@/components/ui/Button";
import { createProjectFromTemplate } from "@/actions/projects";
import { createTemplateCheckout } from "@/actions/billing";
import { TemplatePreviewModal } from "@/components/templates/TemplatePreviewModal";
import { toast } from "sonner";

export default function TemplatesClient({ session, templates }) {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [previewTemplate, setPreviewTemplate] = useState(null);
  const [isPending, startTransition] = useTransition();

  const categories = useMemo(() => {
    const fromDb = [
      ...new Set(
        templates
          .map((t) => (t.category || "").toLowerCase().trim())
          .filter((c) => c && c !== "all"),
      ),
    ].sort();
    return ["all", ...fromDb];
  }, [templates]);

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const cat = (t.category || "").toLowerCase();
      const matchesCategory =
        activeCategory === "all" || cat === activeCategory || cat.includes(activeCategory);
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        !q ||
        t.name.toLowerCase().includes(q) ||
        (t.description || "").toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [templates, activeCategory, searchQuery]);

  function useTemplate(id) {
    if (!session?.user) {
      toast.error("Sign in to use templates");
      router.push("/login?callbackUrl=/templates");
      return;
    }
    startTransition(async () => {
      toast.loading("Creating project…", { id: "tpl" });
      const res = await createProjectFromTemplate(id);
      if (res.ok) {
        toast.success("Project created", { id: "tpl" });
        router.push(`/dashboard/projects/${res.project.slug}/builder`);
      } else {
        toast.error(res.error || "Failed", { id: "tpl" });
      }
    });
  }

  function buyTemplate(id) {
    if (!session?.user) {
      router.push("/login?callbackUrl=/templates");
      return;
    }
    startTransition(async () => {
      const res = await createTemplateCheckout(id);
      if (res.ok && res.url) window.location.href = res.url;
      else toast.error(res.error || "Checkout failed");
    });
  }

  return (
    <div className="relative flex min-h-screen flex-col">
      <LandingHeader session={session} />

      <main className="flex-grow pt-24 pb-16">
        <section className="px-6">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h1 className="mb-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
                Template{" "}
                <span className="bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">
                  marketplace
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-[var(--muted-foreground)]">
                {templates.length} templates from your workspace database — free and premium layouts ready to customize.
              </p>
            </div>

            <div className="mb-10 flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition-all ${
                      activeCategory === cat
                        ? "bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/20"
                        : "border border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] hover:border-indigo-500/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="relative w-full md:w-80">
                <input
                  type="search"
                  placeholder="Search templates…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--card)] py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <svg
                  className="absolute left-3 top-2.5 h-5 w-5 text-[var(--muted-foreground)]"
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

            {filtered.length > 0 ? (
              <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map((template) => {
                  const locked =
                    template.isPremium && template.priceCents > 0 && !template.owned;
                  return (
                    <article
                      key={template.id}
                      className="flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] transition-shadow hover:shadow-xl"
                    >
                      <div
                        className="relative h-44 bg-gradient-to-br from-indigo-600/25 to-violet-600/25"
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
                        <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase text-white backdrop-blur">
                          {locked
                            ? "Premium"
                            : template.isPremium && template.owned
                              ? "Owned"
                              : template.isPremium
                                ? "Premium"
                                : "Free"}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-3 p-5">
                        <div>
                          <h2 className="font-display text-lg font-semibold">{template.name}</h2>
                          {template.description ? (
                            <p className="mt-1 line-clamp-2 text-sm text-[var(--muted-foreground)]">
                              {template.description}
                            </p>
                          ) : null}
                          {template.category ? (
                            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-violet-500">
                              {template.category}
                            </p>
                          ) : null}
                        </div>
                        <div className="mt-auto flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            onClick={() => setPreviewTemplate(template)}
                          >
                            Preview
                          </Button>
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
                            <Button
                              type="button"
                              className="flex-1"
                              disabled={isPending}
                              onClick={() => useTemplate(template.id)}
                            >
                              Use template
                            </Button>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="mb-12 rounded-3xl border border-dashed border-[var(--border)] py-20 text-center">
                <h2 className="mb-2 text-xl font-bold">No templates found</h2>
                <p className="text-[var(--muted-foreground)]">
                  {templates.length === 0
                    ? "Run npm run db:seed to load templates into the database."
                    : "Try a different search or category."}
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      <LandingFooter />

      <TemplatePreviewModal
        isOpen={Boolean(previewTemplate)}
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
        onUse={(id) => {
          setPreviewTemplate(null);
          useTemplate(id);
        }}
      />
    </div>
  );
}
