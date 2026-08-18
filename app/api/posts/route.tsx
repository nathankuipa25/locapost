import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const title = body.title?.trim();
    const content = body.content?.trim();

    if (!title) {
      return NextResponse.json(
        { error: "Title is required." },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "Content is required." },
        { status: 400 }
      );
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
      },
    });

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
      { error: "Something went wrong while saving the post." },
      { status: 500 }
    );
  }
}