import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: any) => {
  const { shopId } = context.params;

  if (!shopId) {
    return NextResponse.json({ message: "Missing shop Id" }, { status: 400 });
  }

  try {
    const shopData = await prisma.repairShops.findUnique({
      where: { id: shopId as string },
      include: {
        images: true,
      },
    });

    if (!shopData) {
      return NextResponse.json({ message: "Shop not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Shop data fetched successfully",
        shop: shopData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
