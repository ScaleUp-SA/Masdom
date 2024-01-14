import { prisma } from "@/lib/prismaClient";
import { CarsImages, CarsVideos } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export const PUT = async function handler(req: NextRequest, res: NextResponse) {
  try {
    const {
      carId,
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
      images, // Changed variable name to match the case in the request
      videos, // Changed variable name to match the case in the request
    } = await req.json();

    if (!images) {
      return NextResponse.json(
        { message: "CarsImages missing" },
        { status: 400 }
      );
    }

    // Update the existing listing car
    const updatedListingCar = await prisma.listingCars.update({
      where: {
        id: carId,
      },
      data: {
        title,
        offerDetails,
        price: Number(price),
        color,
        year,
        transmission,
        country,
        city,
        mileage: Number(mileage),
        featured,
        cylinders: Number(cylinders),
        shape,
        carClass,
        ownerId,
        carsMakersId,
        carsModelsId,
        damage: {
          deleteMany: {},
          createMany: {
            data: damage.map((d: any) => ({
              description: d.description,
            })),
          },
        },
        images: {
          deleteMany: {},
          createMany:
            {
              data: images.map((image: CarsImages) => ({
                links: image.links,
              })),
            } || [],
        },
        videos: {
          deleteMany: {},
          createMany:
            {
              data: videos.map((video: CarsVideos) => ({
                links: video.links,
              })),
            } || [],
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
      { message: "Updated", data: updatedListingCar },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
