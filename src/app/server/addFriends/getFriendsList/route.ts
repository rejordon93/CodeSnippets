import { NextResponse } from "next/server";
import { getAcceptedFriends } from "@/app/actions"; // adjust path if needed

export async function GET() {
  try {
    const data = await getAcceptedFriends();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch accepted friends" },
      { status: 500 }
    );
  }
}
