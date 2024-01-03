import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async function handler(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const {
      title,
      offerDetails,
      price,
      color,
      year,
      transmission,
      country,
      city,
      mileage,
      featured,
      cylinders,
      shape,
      carClass,
      ownerId,
      carsMakersId,
      carsModelsId,
      damage,
      CarsImages,
      CarsVideos,
    } = await req.json();

    if (!damage) {
      return NextResponse.json(
        { message: "damage not exsisting" },
        { status: 400 }
      );
    }

    // Create the new listing car
    const newListingCar = await prisma.listingCars.create({
      data: {
        title,
        offerDetails,
        price,
        color,
        year,
        transmission,
        country,
        city,
        mileage,
        featured,
        cylinders,
        shape,
        carClass,
        ownerId,
        carsMakersId,
        carsModelsId,
        damage: {
          createMany: {
            data: damage,
          },
        },
        images: {
          createMany: {
            data: CarsImages || [],
          },
        },
        videos: {
          createMany: {
            data: CarsVideos || [],
          },
        },
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
      { message: "Created", data: newListingCar },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
