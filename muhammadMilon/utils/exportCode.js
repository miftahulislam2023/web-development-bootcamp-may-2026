/**
 * Serialize builder document to a single static HTML file.
 * @param {{ version?: number, sections: unknown[] }} document
 * @param {{ title?: string }} meta
 */
export function exportPageHtml(document, meta = {}) {
  const title = meta.title || "Nexora Site";
  const blocks = Array.isArray(document?.sections) ? document.sections : [];

  const body = blocks
    .map((section) => sectionToHtml(section))
    .filter(Boolean)
    .join("\n");

  const script = `
    document.addEventListener("DOMContentLoaded", () => {
      // FAQ Toggles
      document.querySelectorAll('.nx-faq-toggle').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const content = btn.nextElementSibling;
          const isHidden = content.style.display === 'none';
          // Close all others in same block optionally, but keeping simple toggle here
          content.style.display = isHidden ? 'block' : 'none';
          const icon = btn.querySelector('.nx-chevron');
          if(icon) icon.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
        });
      });

      // Mobile Menus
      document.querySelectorAll('.nx-menu-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const nav = btn.parentElement.nextElementSibling;
          if(nav && nav.classList.contains('nx-mobile-menu')) {
            nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
          }
        });
      });

      // Forms
      document.querySelectorAll('.nx-form').forEach(form => {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const btn = form.querySelector('button[type="submit"]');
          const originalText = btn.innerText;
          btn.innerText = 'Sending...';
          btn.disabled = true;
          setTimeout(() => {
            btn.innerText = 'Sent!';
            btn.style.backgroundColor = '#16a34a'; // tailwind green-600
            setTimeout(() => {
              btn.innerText = originalText;
              btn.style.backgroundColor = '';
              btn.disabled = false;
              form.reset();
            }, 3000);
          }, 1000);
        });
      });
    });
  `;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; }
    .nx-chevron { transition: transform 0.2s; }
  </style>
</head>
<body class="bg-gray-900 text-white min-h-screen">
${body}
<script>${script}</script>
</body>
</html>`;
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function sectionToHtml(section) {
  if (!section?.type) return "";
  const st = section.style || {};
  const py = Number(st.paddingY) || 0;
  const px = Number(st.paddingX) || 0;
  const maxW = Number(st.maxWidth) || 1200;
  
  // Convert hex background to tailwind inline style if present
  const outerStyle = [
    st.background && st.background !== 'transparent' ? `background:${st.background}` : '',
    st.textColor && st.textColor !== 'inherit' ? `color:${st.textColor}` : '',
    `padding:${py}px ${px}px`
  ].filter(Boolean).join(";");

  const innerOpen = `<div style="max-width:${maxW}px;margin:0 auto">`;
  const innerClose = `</div>`;

  const p = section.props || {};
  let inner = "";

  switch (section.type) {
    case "hero":
      const align = p.align === "left" ? "text-left items-start" : p.align === "right" ? "text-right items-end" : "text-center items-center";
      inner = `<div class="flex flex-col gap-6 ${align}">
        <h1 class="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl max-w-3xl">${escapeHtml(p.title)}</h1>
        <p class="max-w-2xl text-base opacity-90 sm:text-lg">${escapeHtml(p.subtitle)}</p>
        <div class="flex flex-wrap gap-3">
          <button class="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:brightness-110 transition-all">${escapeHtml(p.primaryCta)}</button>
          <button class="rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium hover:bg-white/5 transition-all">${escapeHtml(p.secondaryCta)}</button>
        </div>
      </div>`;
      break;

    case "navbar":
      const links = String(p.links || "").split(",").map(l => l.trim()).filter(Boolean);
      const linksHtml = links.map(l => `<a href="#" class="hover:opacity-100 transition-opacity">${escapeHtml(l)}</a>`).join("");
      const stickyClass = p.sticky ? "sticky top-0 z-10 backdrop-blur-md bg-black/50" : "";
      
      inner = `<header class="flex flex-wrap items-center justify-between gap-4 ${stickyClass}">
        <span class="text-lg font-semibold tracking-tight">${escapeHtml(p.brand)}</span>
        <nav class="hidden md:flex flex-wrap items-center gap-4 text-sm opacity-90">
          ${linksHtml}
        </nav>
        <div class="hidden md:block">
          <button class="rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:brightness-110 transition-all">${escapeHtml(p.cta)}</button>
        </div>
        <div class="md:hidden flex items-center">
          <button class="nx-menu-btn p-2 border border-white/20 rounded">Menu</button>
        </div>
        <div class="nx-mobile-menu w-full basis-full mt-4 flex-col gap-3 hidden md:hidden">
          ${links.map(l => `<a href="#" class="text-sm opacity-90 py-1 border-b border-white/10">${escapeHtml(l)}</a>`).join("")}
          <button class="w-full mt-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white">${escapeHtml(p.cta)}</button>
        </div>
      </header>`;
      break;

    case "footer":
      const cols = String(p.columns || "").split(",").map(c => c.trim()).filter(Boolean);
      inner = `<footer class="grid gap-8 sm:grid-cols-3 text-sm">
        <div>
          <div class="font-semibold">${escapeHtml(p.brand)}</div>
          <p class="mt-2 opacity-80">${escapeHtml(p.tagline)}</p>
        </div>
        <div class="opacity-80 flex flex-col gap-1">
          ${cols.map(c => `<a href="#" class="hover:underline">${escapeHtml(c)}</a>`).join("")}
        </div>
        <div class="opacity-60">© ${new Date().getFullYear()} All rights reserved.</div>
      </footer>`;
      break;

    case "button":
      const btnClass = p.variant === "outline" ? "border border-current hover:bg-white/5" : "bg-blue-600 text-white";
      inner = `<div>
        <a href="${escapeHtml(p.href || '#')}" class="inline-flex rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:brightness-110 ${btnClass}">
          ${escapeHtml(p.label)}
        </a>
      </div>`;
      break;

    case "card":
      inner = `<article class="overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-lg backdrop-blur hover:bg-white/10 transition-colors">
        ${p.image ? `<img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.title)}" class="aspect-video w-full object-cover bg-black/20" />` : `<div class="aspect-video w-full bg-black/20"></div>`}
        <div class="p-6">
          <h3 class="text-lg font-semibold">${escapeHtml(p.title)}</h3>
          <p class="mt-2 text-sm opacity-85">${escapeHtml(p.body)}</p>
        </div>
      </article>`;
      break;

    case "testimonials":
      const tItems = (p.items || []).map(it => `
        <blockquote class="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm hover:border-white/20 transition-colors">
          <p class="opacity-90">"${escapeHtml(it.quote)}"</p>
          <footer class="mt-3 text-xs opacity-70"><span class="font-semibold text-white/90">${escapeHtml(it.author)}</span> · ${escapeHtml(it.role)}</footer>
        </blockquote>
      `).join("");
      inner = `<div>
        <h3 class="text-2xl font-semibold">${escapeHtml(p.heading)}</h3>
        <div class="mt-6 grid gap-4 md:grid-cols-2">${tItems}</div>
      </div>`;
      break;

    case "pricing":
      const pItems = (p.plans || []).map(plan => {
        const features = String(plan.features || "").split(",").map(f => f.trim()).filter(Boolean);
        const fHtml = features.map(f => `<li class="flex items-center gap-2"><span class="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500"></span>${escapeHtml(f)}</li>`).join("");
        return `<div class="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col shadow-sm hover:border-blue-500 transition-colors">
          <div class="text-sm font-medium opacity-80">${escapeHtml(plan.name)}</div>
          <div class="mt-2 text-3xl font-bold">${escapeHtml(plan.price)}</div>
          <ul class="mt-4 text-sm opacity-75 space-y-2 flex-1">${fHtml}</ul>
          <button class="mt-6 w-full rounded-full bg-white/10 px-4 py-2 text-sm font-semibold hover:bg-white/20 transition-colors">Choose Plan</button>
        </div>`;
      }).join("");
      inner = `<div>
        <h3 class="text-2xl font-semibold">${escapeHtml(p.heading)}</h3>
        <div class="mt-8 grid gap-4 md:grid-cols-3">${pItems}</div>
      </div>`;
      break;

    case "contact-form":
      inner = `<div>
        <h3 class="text-2xl font-semibold">${escapeHtml(p.heading)}</h3>
        <p class="mt-2 text-sm opacity-80">${escapeHtml(p.subheading)}</p>
        <form class="nx-form mt-6 grid gap-3 max-w-md">
          <input required class="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Name" />
          <input required type="email" class="rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Email" />
          <textarea required class="min-h-[100px] rounded-lg border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="Message"></textarea>
          <button type="submit" class="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-all hover:brightness-110">${escapeHtml(p.submitLabel)}</button>
        </form>
      </div>`;
      break;

    case "gallery":
      const colsNum = Math.min(4, Math.max(2, Number(p.columns) || 3));
      const caps = String(p.captions || "").split(",").map(c => c.trim()).filter(Boolean);
      const gItems = caps.map(c => `<figure class="group overflow-hidden rounded-xl border border-white/10 relative cursor-pointer">
        <div class="aspect-[4/3] bg-gradient-to-br from-white/10 to-white/5 group-hover:scale-105 transition-transform duration-500"></div>
        <figcaption class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center text-sm font-medium text-white shadow-sm">${escapeHtml(c)}</figcaption>
      </figure>`).join("");
      inner = `<div>
        <h3 class="text-2xl font-semibold">${escapeHtml(p.heading)}</h3>
        <div class="mt-6 grid gap-3" style="grid-template-columns: repeat(${colsNum}, minmax(0, 1fr))">${gItems}</div>
      </div>`;
      break;

    case "faq":
      const faqItems = (p.items || []).map(item => `
        <div class="rounded-xl border border-white/10 bg-white/5 overflow-hidden transition-all">
          <dt class="nx-faq-toggle font-medium p-4 flex justify-between items-center cursor-pointer hover:bg-white/5">
            <span>${escapeHtml(item.q)}</span>
            <svg class="nx-chevron size-4 opacity-50" style="width:16px;height:16px" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
          </dt>
          <dd class="px-4 pb-4 mt-1 text-sm opacity-80 border-t border-white/5 pt-3" style="display:none;">${escapeHtml(item.a)}</dd>
        </div>
      `).join("");
      inner = `<div>
        <h3 class="text-2xl font-semibold">${escapeHtml(p.heading)}</h3>
        <dl class="mt-6 space-y-4">${faqItems}</dl>
      </div>`;
      break;

    default:
      inner = `<div class="p-4 border border-dashed border-white/20 rounded-xl text-sm opacity-70">
        Unknown block type: ${escapeHtml(section.type)}
      </div>`;
  }

  // Determine container classes based on background
  const hasBgStr = st.background && st.background.length > 0 && st.background !== 'transparent';
  return `<section class="relative w-full" style="${outerStyle}">${innerOpen}${inner}${innerClose}</section>`;
}

/** Export canvas JSON as index.html + style.css + script.js */
export function exportTemplateFiles(canvasData, meta = {}) {
  const full = exportPageHtml(canvasData, meta);
  const title = meta.title || "Nexora Site";

  const styleMatch = full.match(/<style>([\s\S]*?)<\/style>/);
  const scriptMatch = full.match(/<script>([\s\S]*?)<\/script>\s*<\/body>/i);

  const css =
    (styleMatch?.[1] || "").trim() ||
    `body { margin: 0; font-family: system-ui, sans-serif; background: #0f172a; color: #fff; }`;

  const js = (scriptMatch?.[1] || "").trim();

  const bodyMatch = full.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const bodyInner = bodyMatch
    ? bodyMatch[1].replace(/<script>[\s\S]*?<\/script>\s*$/i, "").trim()
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css" />
</head>
<body>
${bodyInner}
<script src="script.js"></script>
</body>
</html>`;

  return { html, css, js: js || "// Nexora template interactions" };
}
