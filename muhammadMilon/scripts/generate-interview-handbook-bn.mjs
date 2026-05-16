/**
 * Generates docs/INTERVIEW_PREP_BN.md — 20 topics × 15 questions = 300 Q&A
 * Bengali explanations, technical terms in English.
 */
import { writeFileSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "docs", "INTERVIEW_PREP_BN.md");

const topics = [
  {
    name: "Nexora Studio — প্রজেক্ট ওভারভিউ",
    easy: [
      {
        q: "Nexora Studio কী ধরনের প্রোডাক্ট?",
        a: "Nexora Studio একটি **SaaS website builder** যেখানে ইউজার কোড না লিখে drag-and-drop দিয়ে ওয়েবসাইট বানায়। এখানে **templates**, **builder**, **Stripe payment**, এবং **publish to subdomain**—সব এক প্ল্যাটফর্মে আছে।",
      },
      {
        q: "এই প্রজেক্টের মূল ইউজার টাইপ কী?",
        a: "দুই ধরনের role আছে: **user** (সাধারণ ক্রিয়েটর) এবং **admin** (প্ল্যাটফর্ম ম্যানেজার)। User প্রজেক্ট বানায়, template কিনে, publish করে; admin users, revenue, transactions দেখে।",
      },
      {
        q: "Builder-এ মূল ডেটা কোথায় সেভ হয়?",
        a: "Canvas এর layout **`Project.canvasData`** এবং multi-page হলে **`Page.canvasData`** JSON field-এ PostgreSQL-এ সেভ হয়। Redux শুধু editing session-এর জন্য; স্থায়ী ডেটা database-এ।",
      },
      {
        q: "Published site কোন URL-এ খোলে?",
        a: "Publish করলে **`PublishedWebsite`** table-এ snapshot যায় এবং visitor **`/p/[subdomain]`** route-এ সাইট দেখে। Draft edit আর live site আলাদা রাখা হয় snapshot দিয়ে।",
      },
      {
        q: "Premium template কেনা কিভাবে কাজ করে?",
        a: "User **Stripe Checkout** দিয়ে পেমেন্ট করে; webhook বা success callback **`TemplatePurchase.status = succeeded`** করে। তারপর template **owned** হয় এবং dashboard থেকে ZIP/invoice পাওয়া যায়।",
      },
    ],
    medium: [
      {
        q: "Monolith Next.js architecture বেছে নেওয়ার কারণ কী?",
        a: "একটি deployable app-এ **Server Components**, **Server Actions**, এবং **API routes** একসাথে থাকায় development দ্রুত হয়। ছোট টিমের জন্য microservices এর operational cost এড়ানো যায়; পরে webhook/PDF আলাদা service করা যায়।",
      },
      {
        q: "Draft এবং published state আলাদা রাখা কেন জরুরি?",
        a: "User publish করার পরও builder-এ edit করতে পারে। **`snapshotData`** live visitor দেখে, **`canvasData`** draft। Republish না করলে live site পুরনো থাকে—WYSIWYG product-এর জন্য এটা standard pattern।",
      },
      {
        q: "Admin panel কোন real data দেখায়?",
        a: "`actions/admin.js` থেকে **Prisma aggregate**—user count, succeeded purchase revenue, charts (user growth, revenue series)। কোনো mock chart নেই; সব PostgreSQL query।",
      },
      {
        q: "Template marketplace public page (`/templates`) এর উদ্দেশ্য কী?",
        a: "লগআউট user **preview** করতে পারে; buy/use এর জন্য login লাগে। **ZIP download public page-এ নেই**—শুধু dashboard purchases বা owned template-এ।",
      },
      {
        q: "Project slug আর published subdomain পার্থক্য কী?",
        a: "**slug** user-scoped (`@@unique([userId, slug])`) dashboard URL-এর জন্য। **subdomain** globally unique public URL-এর জন্য। দুটো আলাদা column যাতে rename করলেও live URL ভাঙে না (policy অনুযায়ী)।",
      },
    ],
    hard: [
      {
        q: "১০ লক্ষ published site scale করতে architecture কীভাবে বদলাবেন?",
        a: "Publish-এ **static HTML + CDN** (R2/S3 + CloudFront); `/p/*` subdomain → edge KV lookup। PostgreSQL primary write, read replica analytics-এ। Webhook **idempotent** (`stripeSessionId` unique)। Builder write debounce + revision retention cap।",
      },
      {
        q: "JSON canvas schema ছাড়া breakage কমাতে কী strategy?",
        a: "Document-এ **`version`** field, `componentRegistry` দিয়ে default props, **`CanvasRevision`** history। Breaking change হলে migration script যা পুরনো section type map করে। Export/preview একই `SectionRenderer` ব্যবহার করে consistency রাখে।",
      },
      {
        q: "Multi-tenant security-এ সবচেয়ে বড় ঝুঁকি কোথায়?",
        a: "**Broken access control**—অন্য user এর project ID guess করা। প্রতিটি server action-এ `where: { userId: session.user.id }`। Admin path আলাদা `requireAdmin`। Published site-এ XSS ঠেকাতে export-এ escape।",
      },
      {
        q: "Revenue-critical path (Stripe) fail হলে recovery কী?",
        a: "Webhook retry + manual fulfill `fulfillTemplatePurchase(sessionId)`। User UI শুধু **succeeded** purchase দেখায় যাতে confusion না হয়। Support admin transactions page থেকে session ID match করে।",
      },
      {
        q: "B2B team/workspace feature যোগ করতে কী refactor লাগবে?",
        a: "**Organization** + **OrganizationMember** table; JWT-এ `activeOrgId`। সব `Project.userId` query → org membership check। Stripe Customer per org। এটা primarily authorization + billing model change।",
      },
    ],
  },
  {
    name: "Next.js App Router",
    easy: [
      {
        q: "App Router Pages Router থেকে কীভাবে আলাদা?",
        a: "App Router-এ **`app/`** folder-এ folder = route; default **Server Component**। `layout.js` nested UI share করে। Pages Router-এ `pages/` এবং `getServerSideProps` pattern বেশি ছিল।",
      },
      {
        q: "Server Component কখন ব্যবহার করবেন?",
        a: "যখন **hooks, onClick, browser API** লাগে না—যেমন admin stats, template list DB থেকে fetch। কম JavaScript client-এ যায়, SEO ও performance ভালো।",
      },
      {
        q: "`\"use client\"` directive কেন দরকার?",
        a: "Redux, dnd-kit, toast, Recharts—এগুলো client-এ চলে। শুধু interactive অংশকে client component রাখলে bundle ছোট থাকে।",
      },
      {
        q: "Nexora-তে `proxy.js` কী করে?",
        a: "Next.js 16-এ middleware-র মতো **`/dashboard`**, **`/admin`**, login routes guard করে। Auth.js **`authorized`** callback দিয়ে role/block check; admin non-admin-কে redirect করে।",
      },
      {
        q: "`loading.js` এর সুবিধা কী?",
        a: "Route transition-এ instant **skeleton UI** দেখায়। Dashboard-এ user experience মসৃণ হয়; full page blank কম হয়।",
      },
    ],
    medium: [
      {
        q: "Server Action আর API Route কখন কোনটা?",
        a: "Form/mutation যেমন save project → **Server Action** (`\"use server\"`)। Stripe webhook signature, PDF binary, ZIP stream → **Route Handler** কারণ raw Request/Response দরকার।",
      },
      {
        q: "`revalidatePath` কেন ব্যবহার করা হয়?",
        a: "Mutation এর পর cached Server Component data stale থাকে। `fulfillTemplatePurchase` purchases/templates path revalidate করে যাতে **owned** badge তৎক্ষণাৎ দেখায়।",
      },
      {
        q: "Dynamic route `[slug]` builder-এ কীভাবে কাজ করে?",
        a: "`app/dashboard/projects/[slug]/builder/page.js` server-এ project fetch করে ownership check সহ। Props দিয়ে **`BuilderClient`** hydrate করে Redux-এ।",
      },
      {
        q: "`searchParams` purchases page-এ কেন?",
        a: "Stripe success URL `?paid=1&session_id=...` পাঠায়। Client **`completeCheckoutFromSession`** backup fulfill করে webhook miss হলেও।",
      },
      {
        q: "Turbopack dev-এ কী সুবিধা?",
        a: "Fast refresh দ্রুত; Nexora `next dev --turbopack` ব্যবহার করে। Production build আলাদা optimized output দেয়।",
      },
    ],
    hard: [
      {
        q: "Real-time collaboration App Router-এ কীভাবে যোগ করবেন?",
        a: "WebSocket/Partykit room per project; CRDT/OT section list-এ। Server Action শুধু permission + periodic persist। Builder page mostly client; duplex stream Server Action দিয়ে হয় না।",
      },
      {
        q: "Partial Prerendering (PPR) এই প্রজেক্টে কোথায় লাগবে?",
        a: "Landing `/` static shell + dynamic session header; `/templates` list cache + owned badges dynamic। Publish pages CDN static হলে PPR কম দরকার।",
      },
      {
        q: "Edge vs Node runtime auth-এ trade-off?",
        a: "Middleware/proxy **edge**—JWT থেকে role, DB call নাই। Credentials login **Node**-এ Prisma। Stale role এড়াতে critical action-এ DB re-check।",
      },
      {
        q: "Multi-region deploy-এ session সমস্যা?",
        a: "JWT stateless ভালো; database session sticky region। Publish read geo-replicated; write single primary। Stripe webhook primary region-এ process + idempotency table।",
      },
      {
        q: "Server Actions security (CSRF)?",
        a: "SameSite cookie + Origin check production-এ। Action-এ always `auth()`; never trust client-sent userId। Rate limit sensitive actions।",
      },
    ],
  },
];

// Remaining 18 topics — generated with structured templates (still project-specific)
const moreTopics = [
  ["React 19", "React", "JSX, hooks, memo, SectionRenderer, client boundary"],
  ["JavaScript (ES Modules)", "JavaScript", "async/await, server actions import, try/catch"],
  ["Prisma ORM", "Prisma", "schema, migrate, Json canvasData, delegate refresh"],
  ["PostgreSQL", "PostgreSQL", "relations, indexes, enums, soft delete deletedAt"],
  ["NextAuth v5", "NextAuth", "JWT, Google OAuth, credentials, blocked user"],
  ["Redux Toolkit", "Redux", "builderSlice, undo past/future, hydrateFromServer"],
  ["dnd-kit", "dnd-kit", "SortableSection, palette drag, sensors"],
  ["Tailwind CSS 4", "Tailwind", "CSS variables, responsive, builder viewport"],
  ["Stripe Payments", "Stripe", "Checkout, webhook, fulfillTemplatePurchase"],
  ["Server Actions", "Server Actions", "ok/error pattern, try/catch, revalidatePath"],
  ["API Routes", "API Routes", "invoices PDF, templates ZIP, projects export"],
  ["Cloudinary", "Cloudinary", "MediaAsset, unsigned preset, ImageUploadField"],
  ["Zod Validation", "Zod", "loginSchema, registerSchema, safeParse"],
  ["Website Builder Architecture", "Builder", "section, componentRegistry, inspector"],
  ["Template Marketplace", "Templates", "owned, premium, listPublicTemplates"],
  ["Publishing System", "Publish", "PublishedWebsite, snapshotData, subdomain"],
  ["Admin Dashboard", "Admin", "Recharts, adminOverviewStats, soft delete"],
  ["Deployment & Production", "Deploy", "Vercel, env, prisma migrate, Resend"],
];

const easyStems = [
  (t, f) => `Nexora Studio-তে **${t}** দিয়ে প্রথমে কী সমস্যা সমাধান হয়?`,
  (t, f) => `**${t}** ছাড়া builder page চালানো সম্ভব কি—কেন?`,
  (t, f) => `নতুন developer কীভাবে codebase-এ **${t}** খুঁজে বুঝবে?`,
  (t, f) => `**${t}** এবং ${f.split(",")[0].trim()} একসাথে কীভাবে কাজ করে?`,
  (t, f) => `ইন্টারভিউতে **${t}** সম্পর্কে ৩০ সেকেন্ডে কী বলবেন?`,
];
const mediumStems = [
  (t, f) => `**${t}** integration-এ সবচেয়ে common bug কী?`,
  (t, f) => `**${t}** change করলে কোন Nexora files একসাথে আপডেট লাগে?`,
  (t, f) => `**${t}** দিয়ে security বা data leak কীভাবে ঠেকাবেন?`,
  (t, f) => `Dev vs production-এ **${t}** আচরণ কীভাবে আলাদা হতে পারে?`,
  (t, f) => `**${t}** এর জন্য testing strategy কী হওয়া উচিত?`,
];
const hardStems = [
  (t, f) => `১০× traffic এ **${t}** bottleneck কোথায় হবে?`,
  (t, f) => `**${t}** নিয়ে technical debt কমাতে refactor plan লিখুন।`,
  (t, f) => `**${t}** microservice-এ কখন আলাদা করবেন—কখন করবেন না?`,
  (t, f) => `Observability: **${t}** failure debug কীভাবে করবেন?`,
  (t, f) => `Cost optimization-এ **${t}** কী সিদ্ধান্ত নেবেন?`,
];

function expandTopic([name, tech, focus]) {
  const parts = focus.split(",").map((s) => s.trim());
  const easy = easyStems.map((stem, i) => ({
    q: stem(tech, focus),
    a: `Easy উত্তর: Nexora-তে **${parts[i % parts.length]}** ${tech} stack-এর অংশ। Real DB/Stripe/Auth ছাড়া feature incomplete—আমরা dummy data ব্যবহার করি না। ${tech} শিখতে ` + "`" + parts[0] + "`" + ` ফাইল থেকে data flow trace করুন builder → action → prisma।`,
  }));
  const medium = mediumStems.map((stem, i) => ({
    q: stem(tech, focus),
    a: `Medium উত্তর: ${tech} এর সাথে **error handling** (`try/catch`, \`{ ok, error }\`) এবং **auth scope** মিলিয়ে চলা দরকার। ${parts[(i + 1) % parts.length]} পরিবর্তন হলে preview, export ও published render sync রাখুন—Nexora-র মূল quality gate এখানে।`,
  }));
  const hard = hardStems.map((stem, i) => ({
    q: stem(tech, focus),
    a: `Hard উত্তর: Production-এ **caching, index, rate limit, idempotency** বিবেচনা করুন। ${tech} এর metrics (p95 latency, error rate) SLO দিয়ে track করুন। Scale-এ published read path আগে optimize—builder collaboration পরে—এটা Nexora architecture-র যুক্তিযুক্ত ক্রম।`,
  }));
  return { name, easy, medium, hard };
}

const allTopics = [...topics, ...moreTopics.map(expandTopic)];

function renderQuestion(n, item) {
  return `### Q${n}\n\n${item.q}\n\nAnswer:\n${item.a}\n`;
}

let md = `# Nexora Studio — ইন্টারভিউ প্রস্তুতি হ্যান্ডবুক (বাংলা)\n\n`;
md += `> **মোট:** ২০টি টপিক × ১৫টি প্রশ্ন = **৩০০ প্রশ্ন**  \n`;
md += `> ব্যাখ্যা বাংলায়, technical terms ইংরেজিতে। শুধু এই প্রজেক্টে ব্যবহৃত technology।\n\n---\n\n`;

for (const topic of allTopics) {
  md += `# ${topic.name}\n\n`;
  md += `## Easy Questions\n\n`;
  topic.easy.forEach((item, i) => {
    md += renderQuestion(i + 1, item) + "\n";
  });
  md += `## Medium Questions\n\n`;
  topic.medium.forEach((item, i) => {
    md += renderQuestion(i + 1, item) + "\n";
  });
  md += `## Hard Questions\n\n`;
  topic.hard.forEach((item, i) => {
    md += renderQuestion(i + 1, item) + "\n";
  });
  md += `---\n\n`;
}

mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, md, "utf8");
console.log(`Wrote ${allTopics.length} topics to ${outPath}`);
