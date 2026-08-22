import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getReadingTime } from "@/lib/reading-time";
import { getDescription } from "@/lib/post-summary";

export const revalidate = 0;

// Minimal shape used by the feed. Avoids depending on the generated
// Prisma client's exact type here (it's produced at build time), while
// still keeping the map callback below fully typed instead of `any`.
type PostPreview = {
  id: string;
  title: string;
  content: string;
  contentJson: unknown;
  createdAt: Date;
};

export default async function Home() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-2xl px-5 py-10 sm:py-16">
        {/* Hero */}
        <section className="text-center">
          <p className="mb-6 text-sm font-medium tracking-tight text-gray-900">
            LocaPost
          </p>

          <h1 className="text-4xl font-semibold leading-tight tracking-tight text-gray-950 sm:text-5xl">
            Write without limits.
            <br />
            Share with one link.
          </h1>

          <p className="mx-auto mt-5 max-w-sm text-sm leading-6 text-neutral-500 sm:text-base sm:leading-7">
            Create rich content and share it anywhere with a single link.
          </p>

          <Link
            href="/create"
            className="mt-7 inline-flex min-h-12 items-center justify-center rounded-xl bg-black px-6 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98]"
          >
            Create a post
          </Link>
        </section>

        {/* Feed */}
        <section className="mt-16 sm:mt-20">
          <h2 className="mb-6 text-xs font-semibold uppercase tracking-wide text-neutral-400">
            Recent articles
          </h2>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-200 px-6 py-10 text-center">
              <p className="text-sm text-neutral-500">
                No articles published yet.
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                Be the first to write one.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {posts.map((post: PostPreview) => {
                const description = getDescription(
                  post.contentJson,
                  post.content,
                  140
                );
                const readingTime = getReadingTime(post.content);

                return (
                  <li key={post.id} className="py-6 first:pt-0">
                    <Link
                      href={`/article/${post.id}`}
                      className="group block"
                    >
                      <h3 className="text-lg font-semibold text-gray-950 transition group-hover:text-neutral-600">
                        {post.title}
                      </h3>

                      {description && (
                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                          {description}
                        </p>
                      )}

                      <div className="mt-3 flex items-center gap-2 text-xs text-neutral-400">
                        <span>
                          {new Intl.DateTimeFormat("en", {
                            dateStyle: "medium",
                          }).format(post.createdAt)}
                        </span>

                        <span>·</span>

                        <span>{readingTime} min read</span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
