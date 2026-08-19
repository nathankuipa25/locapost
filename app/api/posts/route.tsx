import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("GET /api/posts error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while fetching posts.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, content } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required." },
        { status: 400 }
      );
    }

    const databaseHost =
      process.env.DATABASE_URL?.match(/@([^/]+)/)?.[1];

    console.log("DATABASE HOST:", databaseHost ?? "DATABASE_URL missing");

    const post = await prisma.post.create({
      data: {
        title: title.trim(),
        content,
      },
    });

    console.log("POST CREATED:", post.id);

    return NextResponse.json(
      {
        message: "Post saved successfully.",
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/posts error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while saving the post.",
      },
      { status: 500 }
    );
  }
}