import { redirect, notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { PostEditor } from "@/app/components/post-editor";

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

  // Only the article's own author can edit it — anyone else (including
  // other signed-in users) gets bounced back to their own dashboard.
  if (post.authorId !== session.user.id) {
    redirect("/dashboard");
  }

  return (
    <PostEditor
      mode="edit"
      postId={post.id}
      initialContentJson={post.contentJson ?? { type: "doc", content: [] }}
    />
  );
}
