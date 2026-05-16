"use client";

import { cn } from "@/utils/cn";
import { BUILDER_SOCIAL_ICON_IDS, getLucideIcon } from "@/utils/iconMap";
import {
  ArrowRight,
  Check,
  Layers,
  Menu,
  ShoppingCart,
} from "lucide-react";
import { Editable } from "@/components/builder/Editable";
import { NavbarBuilder } from "@/components/builder/NavbarBuilder";
import { FooterBuilder } from "@/components/builder/FooterBuilder";
import { ContactFormLive } from "@/components/builder/ContactFormLive";
import { RichTextEditor } from "@/components/builder/RichTextEditor";
import { COMPONENT_DEFAULTS } from "./componentLibrary";
import { useBuilderViewport } from "./BuilderViewportContext";
import { resolveSectionStyle } from "@/lib/builder-styles";

/**
 * Shell wrapper for all sections handling background, padding, and max-width.
 */
function SectionShell({ section, children, className }) {
  const viewport = useBuilderViewport();
  const s = resolveSectionStyle(section.style || {}, viewport);
  const py = Number(s.paddingY) || 0;
  const px = Number(s.paddingX) || 0;
  const mt = Number(s.marginTop) || 0;
  const mb = Number(s.marginBottom) || 0;
  const maxWidth = Number(s.maxWidth) || 1200;
  const minHeight = Number(s.minHeight) || 0;
  const widthPercent = Number(s.widthPercent) || 100;
  const borderRadius = Number(s.borderRadius) || 0;

  return (
    <section
      className={cn("relative overflow-hidden transition-all duration-300", className)}
      style={{
        width: `${widthPercent}%`,
        marginLeft: widthPercent < 100 ? "auto" : undefined,
        marginRight: widthPercent < 100 ? "auto" : undefined,
        marginTop: mt,
        marginBottom: mb,
        minHeight: minHeight || undefined,
        background: s.background || "transparent",
        color: s.textColor || "inherit",
        fontFamily: s.fontFamily && s.fontFamily !== "inherit" ? s.fontFamily : undefined,
        borderRadius: borderRadius ? `${borderRadius}px` : undefined,
        paddingTop: py,
        paddingBottom: py,
        paddingLeft: px,
        paddingRight: px,
      }}
    >
      <div className="mx-auto w-full" style={{ maxWidth }}>
        {children}
      </div>
    </section>
  );
}

/**
 * COMPONENT RENDERERS
 */

function NavbarBasic({ section, isEditor }) {
  const { props, id } = section;
  const links = String(props.links || "").split(",").map(l => l.trim()).filter(Boolean);

  return (
    <header className={cn(
      "flex items-center justify-between gap-6 py-2",
      props.sticky && "sticky top-0 z-50 bg-inherit border-b border-white/5 backdrop-blur-md"
    )}>
      <Editable sectionId={id} propName="brand" value={props.brand} isEditor={isEditor} className="text-xl font-black font-display tracking-tight" />
      <nav className="hidden md:flex items-center gap-8">
        {links.map((l, i) => (
          <a key={i} href="#" className="text-sm font-semibold hover:opacity-70 transition-all">{l}</a>
        ))}
      </nav>
      <div className="flex items-center gap-4">
        <button className="hidden sm:block rounded-full bg-violet-600 px-6 py-2 text-sm font-bold text-white hover:scale-105 transition-all shadow-lg shadow-violet-600/20">
          <Editable sectionId={id} propName="cta" value={props.cta} isEditor={isEditor} />
        </button>
        <button className="md:hidden p-2"><Menu className="size-5" /></button>
      </div>
    </header>
  );
}

function HeroSaas({ section, isEditor }) {
  const { props, id } = section;
  const alignClass = props.align === "center" ? "items-center text-center mx-auto" : props.align === "right" ? "items-end text-right ml-auto" : "items-start text-left";

  return (
    <div className={cn("grid lg:grid-cols-2 items-center gap-16", props.align === "center" && "lg:grid-cols-1")}>
      <div className={cn("flex flex-col gap-8", alignClass, props.align === "center" && "max-w-3xl")}>
        <Editable sectionId={id} propName="title" value={props.title} isEditor={isEditor} as="h1" className="text-5xl md:text-7xl font-black font-display leading-[1.1] tracking-tight" />
        <Editable sectionId={id} propName="subtitle" value={props.subtitle} isEditor={isEditor} as="p" className="text-xl opacity-70 leading-relaxed" />
        <div className="flex flex-wrap gap-4 mt-2">
          <button className="rounded-2xl bg-violet-600 px-10 py-4 font-bold text-white hover:brightness-110 hover:scale-105 transition-all shadow-xl shadow-violet-600/20">
            <Editable sectionId={id} propName="primaryCta" value={props.primaryCta} isEditor={isEditor} />
          </button>
          <button className="rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md px-10 py-4 font-bold hover:bg-white/10 transition-all">
            <Editable sectionId={id} propName="secondaryCta" value={props.secondaryCta} isEditor={isEditor} />
          </button>
        </div>
      </div>
      {props.align !== "center" && (
        <div className="relative rounded-3xl border border-white/10 shadow-2xl overflow-hidden aspect-video bg-white/5">
           <img src={props.image} alt={props.imageAlt || "Hero preview"} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

function HeroPortfolio({ section, isEditor }) {
  const { props, id } = section;
  return (
    <div className="flex flex-col items-center text-center gap-12 py-12">
      <div className="size-32 rounded-full border-4 border-violet-500/20 overflow-hidden bg-white/5 p-1">
        <img src={props.image} alt={props.imageAlt || "Portrait"} className="w-full h-full object-cover rounded-full" />
      </div>
      <div className="space-y-6 max-w-2xl">
        <Editable sectionId={id} propName="title" value={props.title} isEditor={isEditor} as="h1" className="text-6xl font-black font-display" />
        <Editable sectionId={id} propName="subtitle" value={props.subtitle} isEditor={isEditor} as="p" className="text-2xl text-violet-400 font-medium" />
      </div>
      <div className="flex gap-4">
        {BUILDER_SOCIAL_ICON_IDS.map((id) => {
          const Icon = getLucideIcon(id);
          return (
            <button
              key={id}
              type="button"
              aria-label={`Social link ${id}`}
              className="p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:scale-110 transition-all"
            >
              <Icon className="size-5" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ProductInfo({ section, isEditor }) {
  const { props, id } = section;
  return (
    <div className="grid md:grid-cols-2 gap-16 items-center">
      <div className="aspect-square rounded-[40px] bg-white/5 border border-white/10 overflow-hidden shadow-2xl">
        <img src={props.image} alt={props.imageAlt || props.name || "Product"} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
      </div>
      <div className="flex flex-col gap-8">
        <div className="space-y-4">
          <span className="inline-block px-3 py-1 rounded-full bg-violet-600/20 text-violet-400 text-[10px] font-black uppercase tracking-widest border border-violet-600/20">Featured Product</span>
          <Editable sectionId={id} propName="name" value={props.name} isEditor={isEditor} as="h1" className="text-5xl font-black font-display tracking-tight" />
        </div>
        <div className="text-4xl font-black font-display text-violet-500">{props.price}</div>
        <Editable sectionId={id} propName="description" value={props.description} isEditor={isEditor} as="p" className="text-lg opacity-70 leading-relaxed" />
        <button className="w-full py-5 rounded-[24px] bg-white text-black font-black text-lg hover:scale-[1.02] active:scale-95 transition-all shadow-2xl flex items-center justify-center gap-3">
          <ShoppingCart className="size-6" /> Add to Cart
        </button>
      </div>
    </div>
  );
}

function BentoGrid({ section, isEditor }) {
  const { props, id } = section;
  return (
    <div className="space-y-12">
      <Editable sectionId={id} propName="heading" value={props.heading} isEditor={isEditor} as="h2" className="text-3xl md:text-5xl font-black font-display text-center" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[200px]">
        <div className="md:col-span-2 md:row-span-2 rounded-[32px] bg-violet-600/5 border border-violet-600/10 p-10 flex flex-col justify-end gap-2 overflow-hidden relative group">
           <div className="absolute inset-0 bg-gradient-to-t from-violet-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
           <Editable sectionId={id} propName="title1" value={props.title1} isEditor={isEditor} as="h3" className="text-3xl font-black font-display" />
           <p className="opacity-60 text-lg">Scale without limits on our global edge network.</p>
        </div>
        <div className="md:row-span-1 rounded-[32px] bg-white/5 border border-white/10 p-10 flex flex-col justify-end gap-2">
           <Editable sectionId={id} propName="title2" value={props.title2} isEditor={isEditor} as="h3" className="text-xl font-black font-display" />
        </div>
        <div className="md:row-span-1 rounded-[32px] bg-white/5 border border-white/10 p-10 flex flex-col justify-end gap-2">
           <Editable sectionId={id} propName="title3" value={props.title3} isEditor={isEditor} as="h3" className="text-xl font-black font-display" />
        </div>
      </div>
    </div>
  );
}

function Columns2({ section, isEditor }) {
  const { props, id } = section;
  const gridClass = props.ratio === "1/2" ? "md:grid-cols-[1fr_2fr]" : props.ratio === "2/1" ? "md:grid-cols-[2fr_1fr]" : "md:grid-cols-2";
  return (
    <div className={cn("grid gap-16", gridClass)}>
      <div className="space-y-6">
        <Editable sectionId={id} propName="leftTitle" value={props.leftTitle} isEditor={isEditor} as="h2" className="text-4xl font-black font-display" />
        <p className="opacity-60 text-lg leading-relaxed">Nexora Studio empowers teams to ship faster. Our manual builder gives you pixel-perfect control over every element.</p>
        <button className="flex items-center gap-2 text-violet-400 font-bold hover:gap-4 transition-all">Learn more <ArrowRight className="size-4" /></button>
      </div>
      <div className="space-y-6">
        <Editable sectionId={id} propName="rightTitle" value={props.rightTitle} isEditor={isEditor} as="h2" className="text-4xl font-black font-display" />
        <div className="space-y-4">
           {[1,2,3].map(i => (
             <div key={i} className="flex gap-4 items-start">
               <div className="size-6 rounded-full bg-violet-600/20 text-violet-400 flex items-center justify-center shrink-0 mt-1"><Check className="size-3" /></div>
               <p className="opacity-70">Pixel perfect design control with zero code required.</p>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}

function PricingCards({ section, isEditor }) {
  const { props, id } = section;
  return (
    <div className="space-y-16">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <Editable sectionId={id} propName="heading" value={props.heading} isEditor={isEditor} as="h2" className="text-4xl font-black font-display" />
        <p className="opacity-60 text-lg">Simple, transparent pricing that grows with you.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { name: "Starter", price: "$0", color: "bg-white/5" },
          { name: "Pro", price: "$29", color: "bg-violet-600 shadow-2xl shadow-violet-600/30", popular: true },
          { name: "Team", price: "$99", color: "bg-white/5" }
        ].map((plan, i) => (
          <div key={i} className={cn("rounded-[32px] p-10 flex flex-col gap-8 border border-white/10 relative", plan.color)}>
            {plan.popular && <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-violet-600 text-[10px] font-black uppercase rounded-full">Most Popular</div>}
            <div>
               <div className="text-lg font-bold opacity-80 mb-2">{plan.name}</div>
               <div className="text-5xl font-black font-display">{plan.price}<span className="text-sm opacity-50 font-sans font-normal ml-2">/mo</span></div>
            </div>
            <div className="space-y-4 flex-1">
               {[1,2,3,4].map(j => (
                 <div key={j} className="flex gap-3 items-center text-sm">
                   <Check className="size-4 opacity-50" /> Premium Feature {j}
                 </div>
               ))}
            </div>
            <button className={cn("w-full py-4 rounded-2xl font-bold transition-all", plan.popular ? "bg-white text-violet-600" : "bg-white/10 hover:bg-white/20")}>Get Started</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NavbarCentered({ section, isEditor }) {
  const { props, id } = section;
  const links = String(props.links || "").split(",").map((l) => l.trim()).filter(Boolean);
  return (
    <header className="flex flex-col items-center gap-6 py-4 text-center">
      <Editable sectionId={id} propName="brand" value={props.brand} isEditor={isEditor} className="text-xl font-black font-display" />
      <nav className="flex flex-wrap justify-center gap-6">
        {links.map((l, i) => (
          <a key={i} href="#" className="text-sm font-semibold hover:opacity-70">{l}</a>
        ))}
      </nav>
    </header>
  );
}

function FeaturesGrid({ section, isEditor }) {
  const { props, id } = section;
  const items = ["Fast builds", "Responsive", "SEO ready", "Templates", "Export HTML", "Team ready"];
  return (
    <div className="space-y-12">
      <Editable sectionId={id} propName="heading" value={props.heading} isEditor={isEditor} as="h2" className="text-4xl font-black font-display text-center" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-2">
            <div className="size-10 rounded-xl bg-violet-600/20 text-violet-400 flex items-center justify-center font-bold">✓</div>
            <h3 className="font-bold">{item}</h3>
            <p className="text-sm opacity-60">Professional block with editable content in the inspector.</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CtaBanner({ section, isEditor }) {
  const { props, id } = section;
  return (
    <div className="rounded-[32px] bg-violet-600 px-8 py-16 text-center text-white space-y-6">
      <Editable sectionId={id} propName="title" value={props.title} isEditor={isEditor} as="h2" className="text-4xl font-black font-display" />
      <Editable sectionId={id} propName="subtitle" value={props.subtitle} isEditor={isEditor} as="p" className="text-lg opacity-90 max-w-xl mx-auto" />
      <button type="button" className="rounded-2xl bg-white text-violet-700 px-8 py-3 font-bold">
        <Editable sectionId={id} propName="label" value={props.label} isEditor={isEditor} />
      </button>
    </div>
  );
}

function ContactForm({ section, isEditor }) {
  const { props, id } = section;
  return (
    <div className="max-w-lg mx-auto space-y-8">
      <Editable sectionId={id} propName="heading" value={props.heading} isEditor={isEditor} as="h2" className="text-3xl font-black font-display text-center" />
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm" placeholder="Name" readOnly={isEditor} />
        <input className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm" placeholder="Email" readOnly={isEditor} />
        <textarea className="w-full min-h-[120px] rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm" placeholder="Message" readOnly={isEditor} />
        <button type="button" className="w-full rounded-xl bg-violet-600 py-3 font-bold text-white">Send message</button>
      </form>
    </div>
  );
}

function FaqBasic({ section, isEditor }) {
  const { props, id } = section;
  const faqs = [
    { q: "Can I publish for free?", a: "Yes — publish to a Nexora subdomain on any plan." },
    { q: "Do you support custom domains?", a: "Add your domain in project settings after publishing." },
    { q: "Is the builder responsive?", a: "Preview desktop, tablet, and mobile while you edit." },
  ];
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Editable sectionId={id} propName="heading" value={props.heading} isEditor={isEditor} as="h2" className="text-3xl font-black font-display text-center" />
      <div className="space-y-4">
        {faqs.map((f) => (
          <details key={f.q} className="rounded-xl border border-white/10 bg-white/5 p-4 group">
            <summary className="font-bold cursor-pointer list-none flex justify-between">{f.q}</summary>
            <p className="mt-3 text-sm opacity-70">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}

function StatsSimple({ section, isEditor }) {
  const { props, id } = section;
  const stats = [
    { v: "10k+", l: "Sites built" },
    { v: "99.9%", l: "Uptime" },
    { v: "50+", l: "Components" },
    { v: "24/7", l: "Support" },
  ];
  return (
    <div className="space-y-12">
      <Editable sectionId={id} propName="heading" value={props.heading} isEditor={isEditor} as="h2" className="text-3xl font-black font-display text-center" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {stats.map((s) => (
          <div key={s.l}>
            <div className="text-4xl font-black font-display text-violet-500">{s.v}</div>
            <div className="text-sm opacity-60 mt-1">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function HeroMinimal({ section, isEditor }) {
  const { props, id } = section;
  return (
    <div className="text-center max-w-3xl mx-auto space-y-6 py-12">
      <Editable sectionId={id} propName="title" value={props.title || props.heading} isEditor={isEditor} as="h1" className="text-5xl font-black font-display" />
      <Editable sectionId={id} propName="subtitle" value={props.subtitle} isEditor={isEditor} as="p" className="text-xl opacity-70" />
    </div>
  );
}

function FooterBasic({ section, id, isEditor }) {
  return (
    <footer className="pt-16 pb-8 border-t border-white/5 space-y-12">
      <div className="grid md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="text-xl font-black font-display">Nexora Studio</div>
          <p className="text-sm opacity-50 leading-relaxed">The premier visual development platform for modern web teams.</p>
        </div>
        {[1,2,3].map(i => (
          <div key={i} className="space-y-6">
            <div className="text-sm font-bold uppercase tracking-widest text-violet-500">Column {i}</div>
            <ul className="space-y-3">
              {["Link One", "Link Two", "Link Three", "Link Four"].map(l => (
                <li key={l}><a href="#" className="text-sm opacity-60 hover:opacity-100 hover:text-violet-400 transition-all">{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 text-[10px] font-bold uppercase tracking-widest">
        <div>© 2026 Nexora Studio. All rights reserved.</div>
        <div className="flex gap-8">
          <a href="#">Privacy</a>
          <a href="#">Terms</a>
          <a href="#">Security</a>
        </div>
      </div>
    </footer>
  );
}

function LayoutColumns({ section, isEditor, onSelect }) {
  const { props } = section;
  const cols = section.children || [[], []];
  const gap = Number(props.gap) || 24;
  return (
    <div
      className="grid gap-6"
      style={{ gridTemplateColumns: `repeat(${cols.length}, minmax(0, 1fr))`, gap }}
    >
      {cols.map((column, colIdx) => (
        <div key={colIdx} className="min-h-[80px] space-y-4 rounded-xl border border-dashed border-white/10 p-3">
          {column.length === 0 && isEditor ? (
            <p className="text-center text-xs opacity-40 py-6">Drop or add blocks to column {colIdx + 1}</p>
          ) : null}
          {column.map((child) => (
            <SectionRenderer key={child.id} section={child} isEditor={isEditor} onSelect={onSelect} />
          ))}
        </div>
      ))}
    </div>
  );
}

function CardFeature({ section, isEditor }) {
  const { props, id } = section;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-8 space-y-4 max-w-md">
      <Editable sectionId={id} propName="title" value={props.title} isEditor={isEditor} as="h3" className="text-xl font-bold" />
      <Editable sectionId={id} propName="body" value={props.body} isEditor={isEditor} as="p" className="text-sm opacity-70" />
      <button type="button" className="rounded-xl bg-violet-600 px-5 py-2 text-sm font-bold text-white">
        <Editable sectionId={id} propName="buttonLabel" value={props.buttonLabel} isEditor={isEditor} />
      </button>
    </div>
  );
}

function ButtonCta({ section, isEditor }) {
  const { props, id } = section;
  const align = props.align === "center" ? "justify-center" : props.align === "right" ? "justify-end" : "justify-start";
  return (
    <div className={cn("flex", align)}>
      <button
        type="button"
        className="rounded-2xl bg-violet-600 px-8 py-3 font-bold text-white shadow-lg shadow-violet-600/25"
      >
        <Editable sectionId={id} propName="label" value={props.label} isEditor={isEditor} />
      </button>
    </div>
  );
}

function FormInputBlock({ section, isEditor }) {
  const { props } = section;
  return (
    <div className="max-w-md space-y-2">
      <label className="text-sm font-medium">{props.label || "Field"}</label>
      <input
        type={props.inputType || "text"}
        placeholder={props.placeholder || ""}
        className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
        readOnly={isEditor}
      />
      {props.helper ? <p className="text-xs opacity-50">{props.helper}</p> : null}
    </div>
  );
}

/**
 * GENERIC RENDERER FOR OTHER TYPES
 */
function GenericBlock({ type, section, id, isEditor }) {
  const { props } = section;
  return (
    <div className="py-20 text-center border-2 border-dashed border-white/10 rounded-[40px] opacity-40 group-hover:opacity-100 transition-all hover:bg-white/5">
      <div className="flex flex-col items-center gap-4">
        <div className="size-16 rounded-3xl bg-violet-600/10 text-violet-500 flex items-center justify-center">
          <Layers className="size-8" />
        </div>
        <div>
           <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-1">Module: {section.category}</div>
           <Editable sectionId={id} propName="heading" value={props.heading || type.replace(/-/g, ' ')} isEditor={isEditor} as="h3" className="font-display text-3xl font-bold capitalize" />
           <p className="text-xs mt-3 opacity-60 max-w-sm mx-auto">This professional {type} block is ready for manual customization in the right sidebar editor.</p>
        </div>
      </div>
    </div>
  );
}

/**
 * MAIN RENDERER
 */
export function SectionRenderer({ section, isEditor, onSelect, subdomain = null }) {
  const type = section.type;
  const defaults = COMPONENT_DEFAULTS[type] || {};
  const props = { ...defaults, ...section.props };
  const mergedSection = { ...section, props };

  const wrap = (inner) => (
    <SectionShell section={mergedSection} className={cn(isEditor && "group relative ring-2 ring-transparent hover:ring-violet-500 transition-all cursor-pointer")}>
      {isEditor && <div className="absolute inset-0 z-0" onClick={(e) => { e.stopPropagation(); onSelect?.(section.id); }} />}
      <div className="relative z-10">{inner}</div>
    </SectionShell>
  );

  switch (type) {
    case "navbar-basic":
    case "navbar-centered":
    case "navbar-dark":
    case "navbar-glass":
    case "navbar-ecommerce":
      return wrap(<NavbarBuilder section={mergedSection} isEditor={isEditor} />);
    case "hero-saas":
    case "hero-split":
    case "hero-gradient":
    case "hero-agency":
    case "hero-ecommerce":
      return wrap(<HeroSaas section={mergedSection} isEditor={isEditor} />);
    case "hero-minimal": return wrap(<HeroMinimal section={mergedSection} isEditor={isEditor} />);
    case "hero-portfolio": return wrap(<HeroPortfolio section={mergedSection} isEditor={isEditor} />);
    case "product-info": return wrap(<ProductInfo section={mergedSection} isEditor={isEditor} />);
    case "bento-grid": return wrap(<BentoGrid section={mergedSection} isEditor={isEditor} />);
    case "columns-2": return wrap(<Columns2 section={mergedSection} isEditor={isEditor} />);
    case "layout-columns":
      return wrap(<LayoutColumns section={mergedSection} isEditor={isEditor} onSelect={onSelect} />);
    case "card-feature":
    case "features-cards":
      return wrap(<CardFeature section={mergedSection} isEditor={isEditor} />);
    case "button-cta":
      return wrap(<ButtonCta section={mergedSection} isEditor={isEditor} />);
    case "form-input":
      return wrap(<FormInputBlock section={mergedSection} isEditor={isEditor} />);
    case "pricing-cards":
    case "pricing-table":
    case "pricing-single":
      return wrap(<PricingCards section={mergedSection} isEditor={isEditor} />);
    case "features-grid":
    case "features-list":
    case "features-cards":
    case "features-icons":
      return wrap(<FeaturesGrid section={mergedSection} isEditor={isEditor} />);
    case "cta-banner":
    case "cta-minimal":
    case "cta-dark":
      return wrap(<CtaBanner section={mergedSection} isEditor={isEditor} />);
    case "contact-form":
    case "contact-minimal":
    case "contact-info":
      return wrap(<ContactFormLive section={mergedSection} isEditor={isEditor} subdomain={subdomain} />);
    case "rich-text":
      return wrap(<RichTextEditor sectionId={section.id} html={props.html} isEditor={isEditor} />);
    case "faq-basic":
    case "faq-accordion":
    case "faq-cards":
      return wrap(<FaqBasic section={mergedSection} isEditor={isEditor} />);
    case "stats-simple":
    case "stats-cards":
    case "stats-split":
      return wrap(<StatsSimple section={mergedSection} isEditor={isEditor} />);
    case "footer-basic":
    case "footer-multi":
    case "footer-newsletter":
    case "footer-centered":
    case "footer-social":
      return wrap(<FooterBuilder section={mergedSection} isEditor={isEditor} />);
    default: return wrap(<GenericBlock type={type} section={mergedSection} id={section.id} isEditor={isEditor} />);
  }
}
