import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe subset of the auth config, used by middleware.
 *
 * Middleware runs in Next's Edge Runtime, which doesn't support the
 * Node.js-only modules (`node:url`, `node:process`, `node:path`) that
 * the Prisma client depends on. Keeping the provider list here — with
 * no adapter, no Prisma import — lets middleware build its own
 * lightweight NextAuth() instance that never touches Prisma.
 *
 * The full config (adapter included) lives in auth.ts and is used
 * everywhere else: route handlers, server components, server actions.
 */
export default {
  providers: [Google],
} satisfies NextAuthConfig;
