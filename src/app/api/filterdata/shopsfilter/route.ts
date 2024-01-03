import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req: NextRequest, res: NextResponse) => {
  try {
    const uniqueCars = await prisma.repairShops.findMany({
      distinct: ["cars"],
      select: {
        cars: true,
      },
    });

    const uniqueCities = await prisma.repairShops.findMany({
      distinct: ["city"],
      select: {
        city: true,
      },
    });

    const uniqueCountries = await prisma.repairShops.findMany({
      distinct: ["country"],
      select: {
        country: true,
      },
    });

    const cars = uniqueCars.flatMap((car) => car.cars); // Flatten the nested arrays
    const cities = uniqueCities.map((city) => city.city);
    const countries = uniqueCountries.map((country) => country.country);

    const filters = [
      {
        id: "cars",
        name: "السيارات",
        options: cars.map((car) => ({
          value: car,
          label: car,
        })),
      },
      {
        id: "city",
        name: "المدن",
        options: cities.map((city) => ({
          value: city,
          label: city,
        })),
      },
      {
        id: "country",
        name: "الدول",
        options: countries.map((country) => ({
          value: country,
          label: country,
        })),
      },
    ];

    const response = NextResponse.json(
      {
        data: {
          filters,
        },
      },
      { status: 200 }
    );
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
