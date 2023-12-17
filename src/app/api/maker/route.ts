import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest) => {
  try {
    const makers = await prisma.carsMakers.findMany();

    // Check if makers is not empty
    if (!makers || makers.length === 0) {
      return NextResponse.json(
        { message: "No data found in carsMakers" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        makers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET method:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error },
      { status: 500 }
    );
  }
};
