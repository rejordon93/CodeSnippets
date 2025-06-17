import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";

type RequestBody = {
  friendRequestId: number; // This should be the unique ID of the friend request record
};

export async function PUT(req: NextRequest) {
  try {
    const { friendRequestId }: RequestBody = await req.json();

    if (!friendRequestId) {
      return NextResponse.json(
        { error: "friendRequestId is required" },
        { status: 400 }
      );
    }

    const updatedFriendRequest = await prisma.friend.update({
      where: { id: friendRequestId },
      data: { status: "ACCEPTED", updatedAt: new Date() },
    });

    return NextResponse.json({
      message: "Friend request accepted",
      friendRequest: updatedFriendRequest,
    });
  } catch (error) {
    console.error("Error updating friend request:", error);
    return NextResponse.json(
      { error: "Failed to update friend request" },
      { status: 500 }
    );
  }
}
