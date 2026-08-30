import { redirect } from "next/navigation";
import { auth } from "@/auth";

/**
 * Gates a Server Component or Server Action to signed-in admins only.
 * Redirects anonymous visitors to sign in, and signed-in non-admins
 * back to their own dashboard — never reveals that an admin area
 * exists to someone without access.
 */
export async function requireAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return session;
}
