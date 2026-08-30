import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  adapter: PrismaAdapter(prisma),

  session: {
    // JWT sessions rather than database sessions. Middleware runs in
    // the Edge Runtime and needs to verify a session by checking the
    // signed token's signature alone — it can't make a Prisma/DB call
    // to look up a Session row the way the "database" strategy needs.
    // The adapter is still used to create/link User & Account rows on
    // sign-in; it's only the session lookup itself that moves to JWT.
    strategy: "jwt",
  },

  pages: {
    // Route users needing to sign in to the landing page's sign-in UI
    // instead of Auth.js's default unstyled page.
    signIn: "/",
  },

  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, `user` (from the adapter) is available once —
      // stash the database id on the token so it persists across
      // requests without a DB lookup on every one.
      if (user) {
        token.id = user.id;

        let dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true, email: true },
        });

        // Bootstrap: promote a designated set of emails to ADMIN on
        // sign-in, so a production deploy doesn't need direct DB
        // access to create the first admin. Self-healing — add an
        // email to ADMIN_EMAILS and it takes effect on their next
        // sign-in, no manual SQL required.
        const adminEmails = (process.env.ADMIN_EMAILS ?? "")
          .split(",")
          .map((email) => email.trim().toLowerCase())
          .filter(Boolean);

        if (
          dbUser &&
          dbUser.role !== "ADMIN" &&
          dbUser.email &&
          adminEmails.includes(dbUser.email.toLowerCase())
        ) {
          dbUser = await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
            select: { role: true, email: true },
          });
        }

        token.role = dbUser?.role ?? "USER";
      }

      return token;
    },

    session({ session, token }) {
      // Expose the database user id (and role) on the session so
      // server components and API routes can scope queries to "the
      // current user's own posts" — or check admin access — without
      // an extra lookup.
      if (session.user && token.id) {
        session.user.id = token.id as string;
        session.user.role = token.role ?? "USER";
      }
      return session;
    },
  },
});
