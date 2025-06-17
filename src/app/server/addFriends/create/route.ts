import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";

type recipientIdProps = {
  recipientId: number;
};

export async function POST(req: NextRequest) {
  try {
    const { recipientId }: recipientIdProps = await req.json();

    // get user ID
    const user = await prisma.user.findFirst({
      select: {
        id: true,
      },
    });

    if (!user || !user.id) {
      throw new Error("User not found or user ID is undefined");
    }
    console.log(user.id);

    await prisma.friend.create({
      data: {
        requesterId: user.id,
        recipientId,
        status: "PENDING",
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("DB Error:", error);
    return NextResponse.json(
      { error: "Failed to send friend request" },
      { status: 500 }
    );
  }
}
