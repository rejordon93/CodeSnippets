import { NextResponse } from "next/server";
import prisma from "@/database/prisma";

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            username: true,
            isOnline: true, // add this if you have an isOnline field
          },
        },
      },
    });
    return NextResponse.json({ posts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
