import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),

  providers: [Google],

  session: {
    // Database sessions — pairs naturally with the Prisma adapter and
    // lets us revoke a session (e.g. account deletion) server-side.
    strategy: "database",
  },

  pages: {
    // Route users needing to sign in to the landing page's sign-in UI
    // instead of Auth.js's default unstyled page.
    signIn: "/",
  },

  callbacks: {
    session({ session, user }) {
      // Expose the database user id on the session so server components
      // and API routes can scope queries to "the current user's own
      // posts" without an extra lookup.
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
});
