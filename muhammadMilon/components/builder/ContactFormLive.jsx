"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Editable } from "@/components/builder/Editable";

function parseFields(raw) {
  try {
    if (typeof raw === "string") return JSON.parse(raw);
    if (Array.isArray(raw)) return raw;
  } catch {
    /* default */
  }
  return [
    { id: "name", type: "text", label: "Name", required: true, placeholder: "Your name" },
    { id: "email", type: "email", label: "Email", required: true, placeholder: "you@email.com" },
    { id: "message", type: "textarea", label: "Message", required: true, placeholder: "How can we help?" },
  ];
}

export function ContactFormLive({ section, isEditor, subdomain }) {
  const { props, id } = section;
  const fields = parseFields(props.fields);
  const [values, setValues] = useState({});
  const [status, setStatus] = useState("idle");

  async function onSubmit(e) {
    e.preventDefault();
    if (isEditor) return;
    if (!subdomain) {
      toast.error("Publish site to receive submissions");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain,
          fields: values,
          honeypot: values._honeypot || "",
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Failed");
      setStatus("sent");
      setValues({});
      toast.success("Message sent!");
    } catch (err) {
      setStatus("error");
      toast.error(err.message || "Could not send");
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-8">
      <Editable sectionId={id} propName="heading" value={props.heading} isEditor={isEditor} as="h2" className="text-3xl font-black font-display text-center" />
      <form className="space-y-4" onSubmit={onSubmit}>
        <input type="text" name="_honeypot" className="hidden" tabIndex={-1} autoComplete="off" value={values._honeypot || ""} onChange={(e) => setValues((v) => ({ ...v, _honeypot: e.target.value }))} />
        {fields.map((field) => (
          <div key={field.id} className="space-y-1">
            <label className="text-sm font-medium">
              {field.label}
              {field.required ? <span className="text-red-400"> *</span> : null}
            </label>
            {field.type === "textarea" ? (
              <textarea
                required={field.required}
                placeholder={field.placeholder}
                className="w-full min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                value={values[field.id] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                readOnly={isEditor}
              />
            ) : (
              <input
                type={field.type || "text"}
                required={field.required}
                placeholder={field.placeholder}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                value={values[field.id] || ""}
                onChange={(e) => setValues((v) => ({ ...v, [field.id]: e.target.value }))}
                readOnly={isEditor}
              />
            )}
          </div>
        ))}
        <button
          type="submit"
          disabled={isEditor || status === "sending"}
          className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : props.submitLabel || "Send message"}
        </button>
      </form>
    </div>
  );
}
