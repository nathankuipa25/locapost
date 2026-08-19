import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // Safe debugging: logs only the database hostname, never the password.
    const databaseHost = process.env.DATABASE_URL?.match(/@([^/]+)/)?.[1];

    console.log("POST /api/posts");
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