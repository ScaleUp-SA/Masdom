import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prismaClient";
import bcryptjs from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password, phoneNumber } = await req.json();

    // Check if all the data are sent
    if (!username || !email || !password || !phoneNumber)
      return NextResponse.json("البيانات غير صحيحه");

    // Check if the user already exists
    const existUser = await prisma.user.findUnique({ where: { email } });
    if (existUser) {
      return NextResponse.json(
        { message: "هذا البريد الالكتروني مسجل بالفعل" },
        { status: 400 }
      );
    }

    // Create the new user
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        phoneNumber,
      },
    });

    return NextResponse.json({ message: "تم انشاء المستخدم" }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}
