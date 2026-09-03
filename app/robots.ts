import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://locapost.xyz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Everything that requires being signed in — guarded the same
      // way by middleware.ts. /article/[id] is deliberately NOT
      // disallowed here: it's the public share link, and blocking it
      // via robots.txt would also stop link-preview bots (Slack,
      // Twitter, iMessage, etc.) from fetching Open Graph tags when a
      // link is shared. It stays out of search results instead via a
      // per-page `noindex` — the more reliable way to keep a
      // crawlable-but-unlisted page out of search (a robots.txt
      // disallow can still let a bare URL surface in results without
      // a snippet; noindex reliably prevents that).
      disallow: ["/dashboard", "/create", "/edit", "/admin", "/api"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
