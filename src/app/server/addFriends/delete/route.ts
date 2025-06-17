import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const idParam = searchParams.get("friendRequestId");

    if (!idParam) {
      return NextResponse.json(
        { error: "Missing friendRequestId" },
        { status: 400 }
      );
    }

    const id = parseInt(idParam);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid friendRequestId" },
        { status: 400 }
      );
    }

    await prisma.friend.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: "Friend request rejected successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting friend request:", error);
    return NextResponse.json(
      { error: "Failed to reject friend request" },
      { status: 500 }
    );
  }
}
