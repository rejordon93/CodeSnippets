import { NextRequest, NextResponse } from "next/server";
import prisma from "@/database/prisma";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log(reqBody);

    const user = await prisma.user.findUnique({
      where: { email },
    });
    // check if emaill is correct
    if (!user) {
      return NextResponse.json(
        { error: "User dose not exist" },
        { status: 400 }
      );
    }

    // update isOnline = true
    await prisma.user.update({
      where: { email },
      data: {
        isOnline: true,
      },
    });

    //check if password is correct
    const validPassword = await bcryptjs.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    //creart token data
    const tokenData = {
      id: user.id,
    };

    //create token
    const token = await jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1d",
    });

    const userProfile = await prisma.profile.findUnique({
      where: { userId: user.id },
    });
    const hasProfile = !!userProfile;

    const response = NextResponse.json({
      message: "Login successful",
      token,
      username: user.username,
      email: user.email,
      hasProfile,
    });
    response.cookies.set("token", token, { httpOnly: true });

    return response;

    response.cookies.set("token", token, { httpOnly: true });

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
}
