// src\app\api\models\route.ts
import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest, context: any) => {
  const { makerId } = context.params;

  if (!makerId) {
    return NextResponse.json(
      { message: "Maker id is required" },
      { status: 400 }
    );
  }

  try {
    const models = await prisma.carsModels.findMany({
      where: {
        carsMakersId: makerId,
      },
    });

    if (!models || models.length === 0) {
      return NextResponse.json(
        { message: "No models found for this maker" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        models,
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
