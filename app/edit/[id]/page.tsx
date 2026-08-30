import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/app/components/post-editor";
import type { JSONContent } from "@tiptap/react";

type EditPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditPage({ params }: EditPageProps) {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  // Only the article's own author — or an admin — can edit it. Anyone
  // else (including other signed-in users) gets bounced back to their
  // own dashboard.
  if (post.authorId !== session.user.id && session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Safely parse contentJson, falling back to an empty document if invalid
  let initialContentJson: JSONContent = { type: "doc", content: [] };
  
  if (post.contentJson) {
    try {
      const parsed = typeof post.contentJson === 'string' 
        ? JSON.parse(post.contentJson)
        : post.contentJson;
      
      // Validate it's a valid JSONContent object
      if (parsed && typeof parsed === 'object' && parsed.type === 'doc') {
        initialContentJson = parsed as JSONContent;
      }
    } catch {
      // If parsing fails, use the default empty document
      console.warn("Failed to parse post contentJson, using default");
    }
  }

  return (
    <PostEditor
      mode="edit"
      postId={post.id}
      initialContentJson={initialContentJson}
    />
  );
}
