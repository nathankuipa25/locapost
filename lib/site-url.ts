import { headers } from "next/headers";

/**
 * Resolve the site's base URL for building absolute links (canonical,
 * Open Graph, share URLs). Prefers an explicit env var if set, otherwise
 * derives it from the incoming request headers so it works correctly
 * behind Vercel's proxy without hardcoding a domain.
 */
export async function getBaseUrl(): Promise<string> {
  const envUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (envUrl) {
    return envUrl.replace(/\/$/, "");
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? "https";

  return `${protocol}://${host}`;
}
