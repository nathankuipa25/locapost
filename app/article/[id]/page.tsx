import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getReadingTime } from "@/lib/reading-time";
import { getBaseUrl } from "@/lib/site-url";
import { getDescription } from "@/lib/post-summary";
import { ArticleShareButton } from "./share-button";
import { ViewTracker } from "./view-tracker";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    return {
      title: "Article not found | LocaPost",
    };
  }

  const description = getDescription(
    post.contentJson,
    post.content
  );

  const baseUrl = await getBaseUrl();
  const url = `${baseUrl}/article/${post.id}`;

  return {
    title: `${post.title} | LocaPost`,
    description,

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: post.title,
      description,
      type: "article",
      siteName: "LocaPost",
      url,
      publishedTime: post.createdAt.toISOString(),
    },

    twitter: {
      card: "summary",
      title: post.title,
      description,
    },
  };
}

function renderNode(
  node: any,
  index: number
): React.ReactNode {
  if (node.type === "text") {
    let content: React.ReactNode = node.text || "";

    for (const mark of node.marks ?? []) {
      if (mark.type === "bold") {
        content = <strong>{content}</strong>;
      }

      if (mark.type === "italic") {
        content = <em>{content}</em>;
      }

      if (mark.type === "link" && mark.attrs?.href) {
        content = (
          <a
            href={mark.attrs.href}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="font-medium text-[#6D3FEA] underline decoration-[#C4B5FD] underline-offset-2 transition hover:text-[#5425C9] hover:decoration-[#6D3FEA]"
          >
            {content}
          </a>
        );
      }
    }

    return <span key={index}>{content}</span>;
  }

  const children =
    node.content?.map(
      (child: any, childIndex: number) =>
        renderNode(child, childIndex)
    ) ?? [];

  switch (node.type) {
    case "paragraph":
      return (
        <p key={index} className="mb-6">
          {children}
        </p>
      );

    case "heading":
      if (node.attrs?.level === 2) {
        return (
          <h2
            key={index}
            className="mb-4 mt-10 text-2xl font-bold tracking-tight text-gray-950"
          >
            {children}
          </h2>
        );
      }

      return (
        <h3
          key={index}
          className="mb-3 mt-8 text-xl font-bold text-gray-950"
        >
          {children}
        </h3>
      );

    case "bulletList":
      return (
        <ul
          key={index}
          className="mb-6 list-disc space-y-2 pl-6"
        >
          {children}
        </ul>
      );

    case "orderedList":
      return (
        <ol
          key={index}
          className="mb-6 list-decimal space-y-2 pl-6"
        >
          {children}
        </ol>
      );

    case "listItem":
      return <li key={index}>{children}</li>;

    case "blockquote":
      return (
        <blockquote
          key={index}
          className="my-8 border-l-4 border-gray-300 pl-5 text-lg italic text-gray-600"
        >
          {children}
        </blockquote>
      );

    case "hardBreak":
      return <br key={index} />;

    case "codeBlock": {
      const code =
        node.content
          ?.map((child: any) => child.text ?? "")
          .join("") ?? "";

      return (
        <pre
          key={index}
          className="mb-6 overflow-x-auto rounded-lg bg-gray-100 p-4 text-sm leading-6 text-gray-800"
        >
          <code>{code}</code>
        </pre>
      );
    }

    case "horizontalRule":
      return (
        <hr key={index} className="my-8 border-t border-gray-200" />
      );

    default:
      return (
        <div key={index}>
          {children}
        </div>
      );
  }
}

export default async function ArticlePage({
  params,
}: PageProps) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  const contentJson = post.contentJson as any;
  const readingTime = getReadingTime(post.content);
  const baseUrl = await getBaseUrl();
  const articleUrl = `${baseUrl}/article/${post.id}`;

  return (
    <main className="flex-1 bg-white">
      <article className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
        <ViewTracker postId={post.id} />

        {/* Back + brand */}
        <div className="mb-12 flex items-center justify-between">
          <Link
            href="/"
            className="-ml-2 inline-flex min-h-11 items-center gap-1.5 px-2 text-sm font-medium text-neutral-500 transition hover:text-gray-900"
          >
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
            Back
          </Link>

          <Link
            href="/"
            className="text-sm font-bold tracking-tight text-gray-900"
          >
            LocaPost
          </Link>
        </div>

        {/* Header */}
        <header className="mb-10">
          <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-950 sm:text-5xl">
            {post.title}
          </h1>

          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-gray-500">
            <span>
              {new Intl.DateTimeFormat("en", {
                dateStyle: "medium",
              }).format(post.createdAt)}
            </span>

            <span>·</span>

            <span>
              {readingTime} min read
            </span>

            <span className="ml-1">
              <ArticleShareButton url={articleUrl} title={post.title} />
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="text-[17px] leading-8 text-gray-800">
          {contentJson?.content ? (
            contentJson.content.map(
              (node: any, index: number) =>
                renderNode(node, index)
            )
          ) : (
            <div className="whitespace-pre-wrap">
              {post.content}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500">
            Published with{" "}
            <span className="font-semibold text-gray-900">
              LocaPost
            </span>
          </p>

          <p className="mt-1 text-sm text-gray-400">
            Write. Link. Share.
          </p>
        </footer>
      </article>
    </main>
  );
}