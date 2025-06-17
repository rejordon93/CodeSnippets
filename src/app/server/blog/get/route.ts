// app/api/blogData/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { getToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    const userId = await getToken(req);

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const profile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });

    const posts = await prisma.post.findMany({
      where: { authorId: user.id },
      include: { author: true },
    });

    return NextResponse.json({ user: profile, blogs: posts });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
