import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const {
      title,
      discussion,
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
      ownerId, // Assuming ownerId is provided in the request
      carsMakersId, // Assuming carsMakersId is provided in the request
      carsModelsId, // Assuming carsModelsId is provided in the request
      damageDescriptions, // Assuming an array of damage descriptions is provided
    } = await req.json();

    const newListingCar = await prisma.listingCars.create({
      data: {
        title,
        discussion,
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
        class: carClass,
        ownerId,
        carsMakersId,
        carsModelsId,
        Damage: {
          createMany: {
            data: damageDescriptions.map((description: string) => ({
              description,
            })),
          },
        },
      },
      include: {
        Damage: true,
        CarsMakers: true,
        CarsModels: true,
      },
    });

    const response = NextResponse.json({
      data: {
        newListingCar,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
};
