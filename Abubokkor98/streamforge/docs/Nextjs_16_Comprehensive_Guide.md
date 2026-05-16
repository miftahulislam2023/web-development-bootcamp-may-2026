# Next.js 16 Comprehensive Migration & Best Practices Guide

This document synthesizes the architectural changes, API updates, and new conventions introduced in **Next.js 16**. Because Next.js 16 contains significant breaking changes from version 15 and leverages React 19.2 (Canary) features, this guide acts as the single source of truth for developing the StreamForge frontend.

---

## 1. Async Request APIs (Breaking Change)

All request-time APIs that were previously synchronous are now strictly **asynchronous**. You must `await` them.

**Affected APIs:**
- `cookies()`, `headers()`, `draftMode()`
- `params` and `searchParams` props in `page.tsx`, `layout.tsx`, `route.ts`, and `default.tsx`.
- `params` and `id` inside metadata generators (`opengraph-image`, `sitemap`, `icon`).

**Example: Awaiting Page Props**
```tsx
type PageProps<T extends string = any> = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page(props: PageProps) {
  const { slug } = await props.params;
  const query = await props.searchParams;
  return <h1>Post: {slug}</h1>;
}
```
*Note: You can use `npx next typegen` to automatically generate `PageProps`, `LayoutProps`, and `RouteContext` helpers.*

---

## 2. Server Actions & Caching Updates

Next.js 16 refines how caching and mutations are handled, emphasizing explicit cache lifespans and immediate UI updates.

### `updateTag()` vs `revalidateTag()`
- **`revalidateTag(tag, cacheLife)`**: Now *requires* a second argument specifying a `cacheLife` profile. It provides "stale-while-revalidate" behavior.
- **`updateTag(tag)` (NEW)**: A Server Actions-only API that forces immediate expiration and refreshing of data within the same request. Use this for "read-your-writes" scenarios (like forms and settings) so the UI updates instantly.

### `refresh()` (NEW)
A new API exported from `next/cache` that allows you to refresh the client router directly from within a Server Action.

### Stable APIs
`unstable_cacheLife` and `unstable_cacheTag` are now stable. Use `cacheLife` and `cacheTag` from `next/cache`.

---

## 3. Middleware is now Proxy (Breaking Change)

The `middleware.ts` convention is deprecated. It has been renamed to **`proxy.ts`** to clarify its network boundary focus. 

- **File Name**: `proxy.ts` (or `.js`)
- **Export Name**: `export function proxy(request: Request) {}`
- **Runtime**: The `proxy` runtime is now strictly `nodejs` (the `edge` runtime is no longer supported here).
- **Config**: Flags have been renamed (e.g., `skipMiddlewareUrlNormalize` is now `skipProxyUrlNormalize`).

---

## 4. Turbopack by Default

Turbopack is now stable and used by default for both `next dev` and `next build`. You no longer need to pass the `--turbopack` flag. 
- The `turbopack` configuration in `next.config.ts` has been moved to the top level (out of `experimental`).
- To opt-out and fallback to Webpack, use `next build --webpack`.

---

## 5. Caching Architecture: Cache Components & PPR

The experimental Partial Prerendering (PPR) flag (`experimental_ppr`) has been completely removed. 
- You now opt into granular caching by using the **`cacheComponents: true`** configuration in `next.config.ts`.
- Next.js 16 routing deduplicates layouts aggressively: when prefetching multiple URLs with a shared layout, the layout is downloaded exactly once, and only missing parts are fetched incrementally.

---

## 6. `next/image` Breaking Changes

- **Search Queries on Local Images**: To prevent enumeration attacks, local images with query strings (e.g., `src="/photo.png?v=1"`) now require explicit authorization via the `images.localPatterns.search` config.
- **Cache TTL**: The default `minimumCacheTTL` has been aggressively increased from 60 seconds to **4 hours (14400 seconds)** to prevent expensive revalidations on images missing upstream cache-control headers.
- **Image Sizes**: The `16` pixel width has been removed from the default `imageSizes` array to reduce the size of the `srcset` attribute.
- **Qualities**: Default allowed quality is now strictly `[75]`. If you need multiple qualities (e.g., `50, 75, 100`), you must specify them in `next.config.ts`.

---

## 7. React 19.2 & React Compiler

Next.js 16 integrates the React Canary release featuring **React 19.2**, unlocking features like:
- **View Transitions**: Built-in animation handling between navigations.
- **`useEffectEvent`**: For extracting non-reactive logic.
- **React Compiler**: The stable 1.0 release is supported. Enable it via `reactCompiler: true` in `next.config.ts` and install `babel-plugin-react-compiler`. (It is not enabled by default yet).
