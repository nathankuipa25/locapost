import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to edit an article." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Article not found." },
      { status: 404 }
    );
  }

  if (existing.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "You don't have permission to edit this article." },
      { status: 403 }
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

    const post = await prisma.post.update({
      where: { id },
      data: {
        title: title.trim(),
        content: content.trim(),
        contentJson: contentJson ?? null,
      },
    });

    return NextResponse.json({
      message: "Article updated successfully.",
      post,
    });
  } catch (error) {
    console.error("PATCH /api/posts/[id] error:", error);

    return NextResponse.json(
      { error: "Something went wrong while saving the article." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to delete an article." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const existing = await prisma.post.findUnique({
    where: { id },
    select: { authorId: true },
  });

  if (!existing) {
    return NextResponse.json(
      { error: "Article not found." },
      { status: 404 }
    );
  }

  if (existing.authorId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "You don't have permission to delete this article." },
      { status: 403 }
    );
  }

  try {
    await prisma.post.delete({ where: { id } });

    return NextResponse.json({ message: "Article deleted." });
  } catch (error) {
    console.error("DELETE /api/posts/[id] error:", error);

    return NextResponse.json(
      { error: "Something went wrong while deleting the article." },
      { status: 500 }
    );
  }
}
