import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { getToken } from "@/helpers/getDataFromToken";

export async function GET(req: NextRequest) {
  try {
    const userId = await getToken(req);
    console.log(userId);
    const profileData = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId,
        },
      },
    });

    if (!profileData || profileData.length === 0) {
      return NextResponse.json(
        { message: "No profile found" },
        { status: 404 }
      );
    }

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 }
    );
  }
}
