# LifeSolver - SEO Metadata

The following tags and structured data should be added to the `<head>` section of your `index.html` (or main layout file if using a framework like Next.js/React Helmet) to optimize LifeSolver for search engines and social media sharing.

## 1. Primary Meta Tags (Standard SEO)
These tags are essential for search engine results pages (SERPs).

```html
<!-- Primary Meta Tags -->
<title>LifeSolver | The Intelligent Personal Command Center</title>
<meta name="title" content="LifeSolver | The Intelligent Personal Command Center" />
<meta name="description" content="LifeSolver is an all-in-one personal operating system that integrates your tasks, finances, study routines, and habits into a single, beautifully designed dashboard powered by Orbit AI." />
<meta name="keywords" content="personal command center, all-in-one productivity app, AI personal assistant, task management, finance tracker, habit tracker, study analytics, inventory management, LifeSolver, Orbit AI" />
<meta name="author" content="Adnan Shahria" />
<meta name="robots" content="index, follow" />
```

## 2. Open Graph Tags (Facebook, LinkedIn, Discord)
These tags control how your site appears when shared on social platforms.

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website" />
<meta property="og:url" content="https://www.lifesolver.com/" /> <!-- Replace with your actual domain -->
<meta property="og:title" content="LifeSolver | Organize Your Life with AI" />
<meta property="og:description" content="Stop juggling apps. Manage your tasks, track finances, and build habits all in one beautifully cohesive platform powered by Orbit AI." />
<meta property="og:image" content="https://www.lifesolver.com/og-image.png" /> <!-- Add a link to a high-quality preview image (1200x630px) -->
<meta property="og:site_name" content="LifeSolver" />
```

## 3. Twitter Card Tags
These tags ensure your links look great specifically on Twitter/X.

```html
<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image" />
<meta property="twitter:url" content="https://www.lifesolver.com/" /> <!-- Replace with your actual domain -->
<meta property="twitter:title" content="LifeSolver | Your Intelligent Personal OS" />
<meta property="twitter:description" content="Stop juggling apps. Manage your tasks, track finances, and build habits all in one beautifully cohesive platform powered by Orbit AI." />
<meta property="twitter:image" content="https://www.lifesolver.com/twitter-image.png" /> <!-- Same or similar image to your OG image -->
<!-- Optional: If you have a Twitter handle -->
<!-- <meta name="twitter:creator" content="@YourTwitterHandle" /> -->
```

## 4. Theme and UI Optimization Tags
These tags improve the mobile experience, especially for Progressive Web Apps (PWAs).

```html
<!-- UI Optimization -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
<meta name="theme-color" content="#ecfeff" /> <!-- Typical light theme cyan background color from your screenshots -->
```

## 5. JSON-LD Structured Data (Schema.org)
This script helps search engines (like Google) understand exactly what your app is. It should be placed inside a `<script type="application/ld+json">` tag within the `<head>`.

```html
<!-- Structured Data (SoftwareApplication) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "LifeSolver",
  "operatingSystem": "Web",
  "applicationCategory": "ProductivityApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Person",
    "name": "Adnan Shahria"
  },
  "description": "LifeSolver is an all-in-one personal operating system uniting task management, financial tracking, habits, and inventory management under a single AI-driven dashboard.",
  "featureList": [
    "AI Daily Briefing",
    "Task Prioritization & Date Carousel",
    "Financial Income & Expense Tracking",
    "Visual Spending Dashboards",
    "Asset & Hardware Inventory tracking",
    "Habit & Study Analytics",
    "Glassmorphic User Interface"
  ]
}
</script>
```

---

### Implementation Tips:
*   Make sure to replace `https://www.lifesolver.com/` with your actual production domain once you deploy.
*   You need to create a `og-image.png` (recommend size: 1200x630 pixels) featuring a screenshot of your dashboard to display rich link previews.
