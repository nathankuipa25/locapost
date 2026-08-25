import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to view your posts." },
      { status: 401 }
    );
  }

  try {
    const posts = await prisma.post.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/posts error:", error);

    return NextResponse.json(
      { error: "Something went wrong while fetching posts." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to publish an article." },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const { title, content, contentJson } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { error: "Article title is required." },
        { status: 400 }
      );
    }

    if (!content?.trim()) {
      return NextResponse.json(
        { error: "Article content is required." },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        contentJson: contentJson ?? null,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(
      {
        message: "Article published successfully.",
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/posts error:", error);

    return NextResponse.json(
      { error: "Something went wrong while publishing the article." },
      { status: 500 }
    );
  }
}
