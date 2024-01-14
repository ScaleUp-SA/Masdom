import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prismaClient";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Check if all the data are sent
    if (!email || !password) return NextResponse.json("Invalid user data");

    // Check if the user already exists
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (!existUser)
      return NextResponse.json(
        { message: "User not regenerated" },
        { status: 400 }
      );

    // Check if the userpassword is correct
    const vaildPassword = await bcryptjs.compare(password, existUser.password);

    if (!vaildPassword)
      return NextResponse.json(
        { message: "password is incorrect" },
        { status: 400 }
      );

    const tokenPayload = {
      id: existUser.id,
      isAdmin: existUser.isAdmin,
      email: existUser.email,
      username: existUser.username,
    };

    // create a new token
    const token = await jwt.sign(tokenPayload, process.env.TOKEN_SECRET!, {
      expiresIn: "10h",
    });

    const response = NextResponse.json(
      { message: "Login Successful", token: token },
      { status: 201 }
    );
    response.cookies.set("masdoomToken", token, { httpOnly: true });
    return response;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
