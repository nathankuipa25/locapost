import Link from "next/link";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { DeletePostButton } from "@/app/components/delete-post-button";
import { DeleteUserButton } from "./delete-user-button";
import { promoteUserAction, demoteUserAction } from "./actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: {
    index: false,
    follow: false,
  },
};

// Minimal shapes used by the admin lists below. Avoids depending on the
// generated Prisma client's exact type here (it's produced at build
// time), while still keeping the map callbacks fully typed.
type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  _count: { posts: number };
};

type AdminPost = {
  id: string;
  title: string;
  createdAt: Date;
  viewCount: number;
  author: { name: string | null; email: string | null } | null;
};

export default async function AdminPage() {
  const session = await requireAdmin();

  const [userCount, postCount, viewAggregate, users, posts] =
    await Promise.all([
      prisma.user.count(),
      prisma.post.count(),
      prisma.post.aggregate({ _sum: { viewCount: true } }),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          _count: { select: { posts: true } },
        },
      }),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          viewCount: true,
          author: { select: { name: true, email: true } },
        },
      }),
    ]);

  const totalViews = viewAggregate._sum.viewCount ?? 0;
  const dateFormatter = new Intl.DateTimeFormat("en", { dateStyle: "medium" });

  return (
    <main className="flex-1 bg-white">
      <div className="mx-auto w-full max-w-2xl px-5 py-6 sm:py-10">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between sm:mb-10">
          <Link
            href="/dashboard"
            className="-ml-2 inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-medium text-neutral-500 transition hover:text-gray-900"
          >
            <BackIcon />
            Dashboard
          </Link>

          <span className="text-sm font-bold text-gray-900">Admin</span>

          <span className="w-[92px]" aria-hidden="true" />
        </header>

        {/* Stats */}
        <div className="mb-10 grid grid-cols-3 gap-3">
          <StatCard label="Users" value={userCount} />
          <StatCard label="Posts" value={postCount} />
          <StatCard label="Total views" value={totalViews} />
        </div>

        {/* Users */}
        <section className="mb-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">
            Users
          </h2>

          {users.length === 0 ? (
            <p className="text-sm text-neutral-500">No users yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {users.map((user: AdminUser) => {
                const isSelf = user.id === session.user.id;
                const label = user.name || user.email || "this user";

                return (
                  <li key={user.id} className="py-4 first:pt-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-gray-950">
                          {user.name || "Unnamed"}
                          {isSelf && (
                            <span className="ml-1.5 font-normal text-neutral-400">
                              (you)
                            </span>
                          )}
                        </p>

                        <p className="truncate text-xs text-neutral-500">
                          {user.email}
                        </p>

                        <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                          <span
                            className={
                              user.role === "ADMIN"
                                ? "font-medium text-[#6D3FEA]"
                                : ""
                            }
                          >
                            {user.role === "ADMIN" ? "Admin" : "User"}
                          </span>
                          <span>·</span>
                          <span>{user._count.posts} posts</span>
                          <span>·</span>
                          <span>
                            Joined {dateFormatter.format(user.createdAt)}
                          </span>
                        </div>
                      </div>

                      {!isSelf && (
                        <div className="flex shrink-0 items-center gap-1">
                          {user.role === "ADMIN" ? (
                            <form action={demoteUserAction}>
                              <input
                                type="hidden"
                                name="userId"
                                value={user.id}
                              />
                              <button
                                type="submit"
                                className="inline-flex min-h-11 items-center px-2 text-sm text-neutral-500 transition hover:text-gray-900"
                              >
                                Demote
                              </button>
                            </form>
                          ) : (
                            <form action={promoteUserAction}>
                              <input
                                type="hidden"
                                name="userId"
                                value={user.id}
                              />
                              <button
                                type="submit"
                                className="inline-flex min-h-11 items-center whitespace-nowrap px-2 text-sm text-neutral-500 transition hover:text-gray-900"
                              >
                                Make admin
                              </button>
                            </form>
                          )}

                          <DeleteUserButton userId={user.id} userLabel={label} />
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Posts */}
        <section>
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-400">
            All posts
          </h2>

          {posts.length === 0 ? (
            <p className="text-sm text-neutral-500">No posts yet.</p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {posts.map((post: AdminPost) => (
                <li key={post.id} className="py-4 first:pt-0">
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/article/${post.id}`}
                      className="min-w-0 flex-1"
                    >
                      <h3 className="truncate text-sm font-semibold text-gray-950 transition hover:text-neutral-600">
                        {post.title}
                      </h3>

                      <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400">
                        <span className="truncate">
                          {post.author?.name || post.author?.email || "Unknown author"}
                        </span>
                        <span>·</span>
                        <span>{dateFormatter.format(post.createdAt)}</span>
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

                      <DeletePostButton postId={post.id} postTitle={post.title} />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-4 py-4 text-center">
      <p className="text-2xl font-bold text-gray-950">
        {value.toLocaleString()}
      </p>
      <p className="mt-1 text-xs text-neutral-500">{label}</p>
    </div>
  );
}

function BackIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}
