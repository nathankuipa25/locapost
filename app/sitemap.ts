import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://locapost.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  // LocaPost's Post model has no publish/visibility field (checked
  // prisma/schema.prisma) — every article is reachable only via its
  // unguessable share link (cuid), which is the product's actual
  // privacy model: private by default, shared deliberately via link,
  // not "public unless marked private." There's no way to tell "meant
  // to be publicly discoverable" apart from "shared privately" without
  // inventing a schema field, which risks exposing content an author
  // never intended for search engines and goes beyond this task's
  // scope. Per the "if uncertain, prefer privacy" rule, the sitemap
  // stays limited to the page that's unambiguously meant to be found.
  //
  // If LocaPost later adds a visibility/publish flag, extend this to
  // query prisma.post.findMany({ where: { visibility: "PUBLIC" } })
  // and map each into a sitemap entry with its own lastModified.
  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
