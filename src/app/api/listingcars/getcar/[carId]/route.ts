import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: any) => {
  const { carId } = context.params;

  if (!carId) {
    return NextResponse.json({ message: "Missing car Id" }, { status: 400 });
  }

  try {
    const carData = await prisma.listingCars.findUnique({
      where: { id: carId as string },
      include: {
        damage: true,
        images: true,
        videos: true,
        CarsMakers: true,
        CarsModels: true,
      },
    });

    if (!carData) {
      return NextResponse.json({ message: "Car not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Car data fetched successfully",
        car: carData,
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
