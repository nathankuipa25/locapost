import { NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { isLikelyBot } from "@/lib/bot-detection";

// How long a "this visitor already viewed this article" cookie lasts
// before the same visitor can register another view. Long enough to
// absorb refreshes and re-reads in one sitting, short enough that a
// genuine return visit the next day still counts.
const VIEW_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24;

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function POST(request: Request, { params }: RouteParams) {
  const { id } = await params;

  const post = await prisma.post.findUnique({
    where: { id },
    select: { id: true, authorId: true, viewCount: true },
  });

  if (!post) {
    return NextResponse.json(
      { error: "Article not found." },
      { status: 404 }
    );
  }

  const headerList = await headers();
  const userAgent = headerList.get("user-agent") ?? "";

  // Automated traffic (crawlers, uptime monitors, link-preview bots,
  // scripted clients) shouldn't count as a read.
  if (isLikelyBot(userAgent)) {
    return NextResponse.json({ counted: false, viewCount: post.viewCount });
  }

  // Authors don't rack up views by looking at their own writing.
  const session = await auth();

  if (session?.user?.id && session.user.id === post.authorId) {
    return NextResponse.json({ counted: false, viewCount: post.viewCount });
  }

  const cookieStore = await cookies();
  const cookieName = `viewed_${id}`;

  if (cookieStore.get(cookieName)) {
    return NextResponse.json({ counted: false, viewCount: post.viewCount });
  }

  try {
    const updated = await prisma.post.update({
      where: { id },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });

    cookieStore.set(cookieName, "1", {
      maxAge: VIEW_COOKIE_MAX_AGE_SECONDS,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return NextResponse.json({ counted: true, viewCount: updated.viewCount });
  } catch (error) {
    console.error("POST /api/posts/[id]/view error:", error);

    return NextResponse.json(
      { error: "Something went wrong while recording the view." },
      { status: 500 }
    );
  }
}
