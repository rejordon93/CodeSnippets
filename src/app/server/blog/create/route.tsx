import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { getToken } from "@/helpers/getDataFromToken";

type blogType = {
  title: string;
  content: string;
  tags: string[];
};

export async function POST(req: NextRequest) {
  const body: blogType = await req.json();
  const { title, content, tags } = body;

  const userId = await getToken(req);

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const blog = await prisma.post.create({
      data: {
        title,
        content,
        tags,
        author: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    console.error("Blog creation error:", error);
    return NextResponse.json(
      { message: "Failed to create blog post" },
      { status: 500 }
    );
  }
}
