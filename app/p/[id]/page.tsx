import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostPage({ params }: PageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
  });

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-2xl px-5 py-10">
        <header className="mb-8">
          <p className="mb-3 text-sm text-gray-500">
            LocaPost
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            {post.title}
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {new Intl.DateTimeFormat("en", {
              dateStyle: "medium",
            }).format(post.createdAt)}
          </p>
        </header>

        <div className="whitespace-pre-wrap text-[17px] leading-8 text-gray-800">
          {post.content}
        </div>
      </article>
    </main>
  );
}