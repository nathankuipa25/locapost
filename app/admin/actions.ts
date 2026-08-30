"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

async function requireAdminSession() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Not authorized.");
  }

  return session;
}

export async function promoteUserAction(formData: FormData) {
  const session = await requireAdminSession();
  const userId = formData.get("userId");

  if (typeof userId !== "string" || !userId) return;

  // Can't change your own role from this screen — avoids accidentally
  // locking yourself out of the admin area.
  if (userId === session.user.id) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: "ADMIN" },
  });

  revalidatePath("/admin");
}

export async function demoteUserAction(formData: FormData) {
  const session = await requireAdminSession();
  const userId = formData.get("userId");

  if (typeof userId !== "string" || !userId) return;

  if (userId === session.user.id) return;

  await prisma.user.update({
    where: { id: userId },
    data: { role: "USER" },
  });

  revalidatePath("/admin");
}

export async function deleteUserAction(
  userId: string
): Promise<{ error: string } | { success: true }> {
  const session = await requireAdminSession();

  if (userId === session.user.id) {
    return { error: "You can't delete your own account from here." };
  }

  try {
    // Post.authorId, Account.userId, and Session.userId all cascade on
    // delete, so this cleanly removes the user's posts, linked OAuth
    // accounts, and active sessions along with the user row.
    await prisma.user.delete({ where: { id: userId } });

    revalidatePath("/admin");

    return { success: true };
  } catch (error) {
    console.error("deleteUserAction error:", error);

    return { error: "Something went wrong while deleting this user." };
  }
}
