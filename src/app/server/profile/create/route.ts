import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import { getToken } from "@/helpers/getDataFromToken";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstname, lastname, state, city, zip, university } = body;

    if (!firstname || !lastname || !state || !city || !zip || !university) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const userId = await getToken(req);
    console.log("User ID:", userId);

    const profile = await prisma.profile.create({
      data: {
        firstname,
        lastname,
        state,
        city,
        zip,
        university,
        user: {
          connect: { id: userId },
        },
      },
    });

    return NextResponse.json(
      { message: "Profile created", profile },
      { status: 201 }
    );
  } catch (error) {
    console.error("Profile creation failed:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
