import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getReadingTime } from "@/lib/reading-time";
import { DeletePostButton } from "@/app/components/delete-post-button";

// Minimal shape used by the dashboard list. Avoids depending on the
// generated Prisma client's exact type here (it's produced at build
// time), while still keeping the map callback below fully typed.
type OwnedPost = {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  viewCount: number;
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/");
  }

  const posts = await prisma.post.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between sm:mb-10">
          <Link href="/" className="text-sm font-bold text-gray-900">
            LocaPost
          </Link>

          <form action={signOutAction}>
            <button
              type="submit"
              className="-mr-2 inline-flex min-h-11 items-center px-2 text-sm text-neutral-500 transition hover:text-gray-900"
            >
              Sign out
            </button>
          </form>
        </header>

        {/* Account + primary action */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="truncate text-sm text-neutral-500">
            Signed in as {session.user.email}
          </p>

          <Link
            href="/create"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-black px-4 text-sm font-medium text-white transition hover:bg-neutral-800 sm:self-auto"
          >
            + New post
          </Link>
        </div>

        {/* Post list */}
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-neutral-200 px-6 py-10 text-center">
            <p className="text-sm text-neutral-500">
              You haven&apos;t published anything yet.
            </p>
            <Link
              href="/create"
              className="mt-4 inline-flex min-h-10 items-center justify-center rounded-xl bg-black px-5 text-sm font-medium text-white transition hover:bg-neutral-800"
            >
              Write your first post
            </Link>
          </div>
        ) : (
          <ul className="divide-y divide-neutral-100">
            {posts.map((post: OwnedPost) => {
              const readingTime = getReadingTime(post.content);

              return (
                <li key={post.id} className="py-4 first:pt-0 sm:py-5">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/article/${post.id}`}
                      className="min-w-0 flex-1"
                    >
                      <h3 className="truncate text-base font-semibold text-gray-950 transition hover:text-neutral-600">
                        {post.title}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                        <span>
                          {new Intl.DateTimeFormat("en", {
                            dateStyle: "medium",
                          }).format(post.createdAt)}
                        </span>
                        <span>·</span>
                        <span>{readingTime} min read</span>
                        <span>·</span>
                        <span>{post.viewCount} views</span>
                      </div>
                    </Link>

                    <div className="flex shrink-0 items-center gap-1">
                      <Link
                        href={`/edit/${post.id}`}
                        className="inline-flex min-h-11 items-center px-2 text-sm text-neutral-500 transition hover:text-gray-900"
                      >
                        Edit
                      </Link>

                      <DeletePostButton
                        postId={post.id}
                        postTitle={post.title}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
