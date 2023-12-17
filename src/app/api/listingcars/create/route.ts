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
      damageDescriptions,
      CarsImages,
      CarsVideos,
    } = await req.json();

    // Validate required fields
    if (!title || !price || !ownerId || !carsMakersId || !carsModelsId) {
      return NextResponse.json(
        { message: "Required fields missing" },
        { status: 400 }
      );
    }

    // Create damage, images, and videos data
    const damageData = damageDescriptions
      ? damageDescriptions.map((description: string) => ({ description }))
      : [];
    const imagesData = CarsImages
      ? CarsImages.map((link: string) => ({ Links: link }))
      : [];
    const videosData = CarsVideos
      ? CarsVideos.map((link: string) => ({ Links: link }))
      : [];

    // Create the new car listing
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
        Damage: { createMany: { data: damageData } },
        Images: { createMany: { data: imagesData } },
        Videos: { createMany: { data: videosData } },
      },
      include: {
        Damage: true,
        CarsMakers: true,
        CarsModels: true,
        Images: true,
        Videos: true,
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
