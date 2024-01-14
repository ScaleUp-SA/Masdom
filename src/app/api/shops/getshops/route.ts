import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    interface Filters {
      city?: string[];
      cars?: string[];
      country?: string[];
    }

    let whereFilters: any[] = [];

    const requestBody = await req.text();

    if (requestBody) {
      const { filters } = JSON.parse(requestBody) as { filters: Filters };

      if (filters.city && filters.city.length > 0) {
        whereFilters.push({ city: { in: filters.city } });
      }

      if (filters.country && filters.country.length > 0) {
        whereFilters.push({ country: { in: filters.country } });
      }

      if (filters.cars && filters.cars.length > 0) {
        whereFilters.push({ cars: { hasSome: filters.cars } });
      }
    }

    let shops;

    if (whereFilters.length === 0) {
      // If no filters provided, return all RepairShops
      shops = await prisma.repairShops.findMany({
        include: {
          images: true,
        },
      });
    } else {
      // If filters provided, apply the specified filters
      shops = await prisma.repairShops.findMany({
        where: {
          OR: whereFilters,
        },
        include: {
          images: true,
        },
      });
    }

    const response = NextResponse.json({
      data: {
        shops,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
};
