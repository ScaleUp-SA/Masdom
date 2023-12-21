import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const PUT = async function handler(req: NextRequest, res: NextResponse) {
  try {
    const { id, featured } = await req.json();

    // Find the existing listing car
    const existingListingCar = await prisma.listingCars.findUnique({
      where: {
        id: id,
      },
    });

    if (!existingListingCar) {
      return NextResponse.json(
        { message: "Listing car not found" },
        { status: 404 }
      );
    }

    // Update the featured field
    const updatedListingCar = await prisma.listingCars.update({
      where: {
        id: id,
      },
      data: {
        featured,
      },
      include: {
        CarsMakers: true,
        CarsModels: true,
        damage: true,
        images: true,
        videos: true,
      },
    });

    return NextResponse.json(
      { message: "Updated", data: updatedListingCar },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
