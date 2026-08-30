import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// This is the edge-safe config used by both auth.ts and middleware.ts
// It contains the providers and any other NextAuth config that doesn't
// require database access or Node.js-only modules.
export default {
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],

  callbacks: {
    // Pass-through only — no Prisma here (Edge Runtime can't load it).
    // The real role lookup/bootstrap happens in auth.ts's jwt callback
    // when the token is first issued; middleware (built from this
    // config) just needs to read that same claim back off the token.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: "USER" | "ADMIN" }).role ?? token.role;
      }
      return token;
    },

    session({ session, token }) {
      if (session.user) {
        if (token.id) session.user.id = token.id as string;
        session.user.role = token.role ?? "USER";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
