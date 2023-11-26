import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    const params = Object.fromEntries(req.nextUrl.searchParams.entries());
    const {
      page = "1",
      perPage = "10",
      sortBy = "year",
      orderBy = "asc",
      color,
      transmission,
      country,
      price,
      year,
      city,
      carClass,
      shape,
      cylinders,
      ...filters
    } = params;

    const whereConditions = {
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value) {
          return { ...acc, [key]: { equals: value } };
        }
        return acc;
      }, {}),
      color: color ? { equals: color } : undefined,
      transmission: transmission ? { equals: transmission } : undefined,
      country: country ? { equals: country } : undefined,
      price: price ? { equals: price } : undefined,
      year: year ? { equals: year } : undefined,
      city: city ? { equals: city } : undefined,
      carClass: carClass ? { equals: carClass } : undefined,
      shape: shape ? { equals: shape } : undefined,
      cylinders: cylinders ? { equals: cylinders } : undefined,
    };

    const listingCars = await prisma.listingCars.findMany({
      skip: (parseInt(page) - 1) * parseInt(perPage),
      take: parseInt(perPage),
      orderBy: {
        [sortBy]: orderBy === "asc" ? "asc" : "desc",
      },
      where: whereConditions,
      include: {
        CarsMakers: true,
        CarsModels: true,
        Damage: true,
      },
    });

    const totalCars = await prisma.listingCars.count();

    const response = NextResponse.json({
      data: {
        listingCars,
        pagination: {
          page: parseInt(page),
          perPage: parseInt(perPage),
          totalPages: Math.ceil(totalCars / parseInt(perPage)),
          totalCars,
        },
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
};
