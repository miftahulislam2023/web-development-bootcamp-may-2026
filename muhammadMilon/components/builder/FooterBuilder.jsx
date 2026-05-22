"use client";

import { getLucideIcon } from "@/utils/iconMap";
import { Editable } from "@/components/builder/Editable";
import { parseFooterColumns, parseSocialLinks } from "@/lib/parse-menu";

const DEFAULT_COLUMNS = `Product
Features|#
Pricing|#
Docs|#
---
Company
About|#
Blog|#
Careers|#
---
Legal
Privacy|#
Terms|#`;

export function FooterBuilder({ section, isEditor }) {
  const { props, id } = section;
  const columns = parseFooterColumns(props.columns || DEFAULT_COLUMNS);
  const socials = parseSocialLinks(props.socialLinks || "twitter:#,github:#,linkedin:#");

  return (
    <footer className="pt-12 pb-8 space-y-10">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4 lg:col-span-1">
          <Editable sectionId={id} propName="brand" value={props.brand || "Nexora"} isEditor={isEditor} className="text-lg font-black font-display" />
          <p className="text-sm opacity-60 leading-relaxed">{props.tagline || "Build beautiful sites visually."}</p>
          {(props.email || props.phone || props.address) && (
            <div className="text-sm opacity-70 space-y-1">
              {props.email ? <div>{props.email}</div> : null}
              {props.phone ? <div>{props.phone}</div> : null}
              {props.address ? <div>{props.address}</div> : null}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            {socials.map((s) => {
              const Icon = getLucideIcon(s.network) || getLucideIcon("link");
              return (
                <a
                  key={s.network}
                  href={s.url}
                  aria-label={s.network}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
                  onClick={(e) => isEditor && e.preventDefault()}
                >
                  <Icon className="size-4" />
                </a>
              );
            })}
          </div>
        </div>
        {columns.map((col, i) => (
          <div key={i} className="space-y-4">
            <div className="text-xs font-bold uppercase tracking-widest text-violet-500">{col.title}</div>
            <ul className="space-y-2">
              {col.links.map((link, j) => (
                <li key={j}>
                  <a href={link.href} className="text-sm opacity-60 hover:opacity-100" onClick={(e) => isEditor && e.preventDefault()}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row justify-between gap-4 text-xs opacity-50">
        <Editable
          sectionId={id}
          propName="copyright"
          value={props.copyright || "© 2026 Nexora Studio. All rights reserved."}
          isEditor={isEditor}
        />
      </div>
    </footer>
  );
}

