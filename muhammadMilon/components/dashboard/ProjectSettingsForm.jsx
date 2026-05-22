"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  setCustomDomain,
  verifyCustomDomain,
  updatePublishedSubdomain,
} from "@/actions/publish";
import { listFormSubmissions } from "@/actions/forms";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";

export function ProjectSettingsForm({ project }) {
  const [domain, setDomain] = useState(project.published?.customDomain || "");
  const [subdomain, setSubdomain] = useState(project.published?.subdomain || "");
  const [verifyToken, setVerifyToken] = useState(project.published?.domainVerifyToken || "");
  const [domainVerified, setDomainVerified] = useState(project.published?.domainVerified || false);
  const [loading, setLoading] = useState(false);
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    if (project.id) {
      listFormSubmissions(project.id).then(setSubmissions);
    }
  }, [project.id]);

  async function saveDomain(e) {
    e.preventDefault();
    if (!project.published) {
      toast.error("Publish the site from the builder first.");
      return;
    }
    setLoading(true);
    try {
      const res = await setCustomDomain(project.id, domain);
      if (!res.ok) throw new Error(res.error || "Could not save");
      if (res.verifyToken) setVerifyToken(res.verifyToken);
      setDomainVerified(false);
      toast.success("Custom domain saved — add DNS records below");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function saveSubdomain(e) {
    e.preventDefault();
    if (!project.published) {
      toast.error("Publish first.");
      return;
    }
    setLoading(true);
    try {
      const res = await updatePublishedSubdomain(project.id, subdomain);
      if (!res.ok) throw new Error(res.error || "Could not update");
      setSubdomain(res.published.subdomain);
      toast.success(`Subdomain updated: /p/${res.published.subdomain}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  async function onVerifyDomain() {
    setLoading(true);
    try {
      const res = await verifyCustomDomain(project.id);
      if (!res.ok) throw new Error(res.error || "Verification failed");
      setDomainVerified(true);
      toast.success("Domain marked as verified");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  const liveOrigin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Free subdomain</CardTitle>
          <CardDescription>
            Your site is available at{" "}
            {project.published ? (
              <a
                href={`/p/${project.published.subdomain}`}
                target="_blank"
                rel="noreferrer"
                className="font-medium text-violet-500 hover:underline"
              >
                {liveOrigin}/p/{project.published.subdomain}
              </a>
            ) : (
              "Not published yet"
            )}
            . HTTPS is provided automatically on Nexora hosting.
          </CardDescription>
        </CardHeader>
        {project.published ? (
          <CardContent>
            <form className="flex gap-2" onSubmit={saveSubdomain}>
              <div className="flex-1 space-y-1.5">
                <Label htmlFor="subdomain">Subdomain slug</Label>
                <div className="flex items-center gap-1 text-sm">
                  <span className="text-[var(--muted-foreground)]">/p/</span>
                  <Input
                    id="subdomain"
                    value={subdomain}
                    onChange={(e) => setSubdomain(e.target.value)}
                    className="flex-1"
                  />
                </div>
              </div>
              <Button type="submit" className="self-end" disabled={loading}>
                Update
              </Button>
            </form>
          </CardContent>
        ) : null}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Custom domain</CardTitle>
          <CardDescription>
            Connect your own domain with a CNAME to your deployment and verify ownership via DNS TXT.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-3" onSubmit={saveDomain}>
            <div className="space-y-1.5">
              <Label htmlFor="customDomain">Domain hostname</Label>
              <Input
                id="customDomain"
                placeholder="www.example.com"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading || !project.published}>
              {loading ? "Saving…" : "Save domain"}
            </Button>
          </form>

          {domain && verifyToken ? (
            <div className="rounded-xl border border-[var(--border)] bg-[var(--muted)]/30 p-4 space-y-3 text-sm">
              <p className="font-semibold">DNS settings</p>
              <div className="space-y-2 font-mono text-xs">
                <p>
                  <span className="text-[var(--muted-foreground)]">CNAME</span>{" "}
                  {domain} → <span className="text-violet-500">cname.vercel-dns.com</span> (or your host)
                </p>
                <p>
                  <span className="text-[var(--muted-foreground)]">TXT</span>{" "}
                  _nexora-verify.{domain} → <span className="break-all">{verifyToken}</span>
                </p>
              </div>
              <p className="text-xs text-[var(--muted-foreground)]">
                SSL certificates are issued automatically once DNS propagates and the domain is verified.
              </p>
              {domainVerified ? (
                <p className="text-emerald-600 text-xs font-semibold">✓ Domain verified</p>
              ) : (
                <Button type="button" size="sm" variant="secondary" onClick={onVerifyDomain} disabled={loading}>
                  I added the TXT record — verify
                </Button>
              )}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-display text-lg">Form submissions</CardTitle>
          <CardDescription>Messages from contact forms on your published site.</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length === 0 ? (
            <p className="text-sm text-[var(--muted-foreground)]">No submissions yet.</p>
          ) : (
            <ul className="space-y-3 max-h-80 overflow-y-auto">
              {submissions.map((s) => (
                <li key={s.id} className="rounded-lg border border-[var(--border)] p-3 text-sm">
                  <p className="text-[10px] text-[var(--muted-foreground)]">
                    {new Date(s.createdAt).toLocaleString()}
                  </p>
                  <pre className="mt-1 text-xs whitespace-pre-wrap">{JSON.stringify(s.data, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
