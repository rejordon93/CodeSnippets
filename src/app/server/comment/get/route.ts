// app/api/comments/get/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const postId = Number(searchParams.get("postId"));

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    const comments = await prisma.comment.findMany({
      where: { postId },
      include: {
        user: {
          select: { username: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ comments }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch comments:", error);
    return NextResponse.json(
      { message: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}
