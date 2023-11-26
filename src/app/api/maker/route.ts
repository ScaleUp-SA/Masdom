import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const { maker } = await req.json();

    const createdMakers = await prisma.carsMakers.createMany({
      data: maker,
    });
    return NextResponse.json({ message: "created maker" });
  } catch (error) {
    console.log(error);
  }
};
