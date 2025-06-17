import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { getToken } from "@/helpers/getDataFromToken";

type CommentRequestBody = {
  comment: string;
  postId: number;
};

export async function POST(req: NextRequest) {
  try {
    const { comment, postId }: CommentRequestBody = await req.json();

    const userId = await getToken(req);
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const newComment = await prisma.comment.create({
      data: {
        comment,
        post: { connect: { id: postId } },
        user: { connect: { id: userId } },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Comment creation error:", error);
    return NextResponse.json(
      { message: "Failed to create comment" },
      { status: 500 }
    );
  }
}
