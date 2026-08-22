import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getReadingTime } from "@/lib/reading-time";
import { getBaseUrl } from "@/lib/site-url";
import { ArticleShareButton } from "./share-button";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getDescription(content: unknown, fallback: string) {
  if (!content || typeof content !== "object") {
    return fallback.slice(0, 160);
  }

  const json = content as {
    content?: Array<{
      content?: Array<{
        text?: string;
      }>;
    }>;
  };

  const text =
    json.content
      ?.flatMap((node) => node.content ?? [])
      .map((node) => node.text ?? "")
      .join(" ")
      .replace(/\s+/g, " ")
      .trim() || fallback;

  return text.slice(0, 160);
}

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
    <main className="min-h-screen bg-white">
      <article className="mx-auto max-w-2xl px-5 py-10 sm:py-16">
        {/* Brand */}
        <div className="mb-12">
          <span className="text-sm font-bold tracking-tight text-gray-900">
            LocaPost
          </span>
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