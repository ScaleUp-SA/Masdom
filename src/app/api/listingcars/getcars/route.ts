import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

interface Detail {
  id: string | null;
}

const getMakerIds = async (
  names: string[],
  prismaEntity: any // Adjust this type to reflect the Prisma entity type for carsMakers
): Promise<string[] | undefined> => {
  try {
    const details: Detail[] = await prismaEntity.findMany({
      where: {
        name: {
          in: names,
        },
      },
      select: {
        id: true,
      },
    });
    return details
      .map((detail) => detail.id)
      .filter((id) => id !== null) as string[];
  } catch (error) {
    console.error("Error in getMakerIds:", error);
    return undefined;
  }
};

const getModelIds = async (
  names: string[],
  prismaEntity: any
): Promise<string[] | undefined> => {
  try {
    const details: Detail[] = await prismaEntity.findMany({
      where: {
        name: {
          in: names,
        },
      },
      select: {
        id: true,
      },
    });
    return details
      .map((detail) => detail.id)
      .filter((id) => id !== null) as string[];
  } catch (error) {
    console.error("Error in getModelIds:", error);
    return undefined;
  }
};
export const POST = async (req: NextRequest, res: NextResponse) => {
  try {
    interface Filters {
      [key: string]: string | string[] | { in: string[] };
    }

    let whereFilters: Filters = {};

    const requestBody = await req.text();

    if (requestBody) {
      const { filters } = JSON.parse(requestBody) as { filters: Filters };

      for (const key in filters) {
        if (Object.prototype.hasOwnProperty.call(filters, key)) {
          if (key === "maker" || key === "model") {
            const ids = await (key === "maker"
              ? getMakerIds(filters[key] as string[], prisma.carsMakers)
              : getModelIds(filters[key] as string[], prisma.carsModels));
            if (ids && ids.length > 0) {
              whereFilters[
                `${key === "maker" ? "carsMakers" : "carsModels"}Id`
              ] = { in: ids };
            }
          } else {
            if (Array.isArray(filters[key])) {
              whereFilters[key] = {
                in: filters[key] as string[],
              };
            } else {
              whereFilters[key] = filters[key];
            }
          }
        }
      }
    }

    const listingCars = await prisma.listingCars.findMany({
      include: {
        CarsMakers: true,
        CarsModels: true,
        damage: true,
        images: true,
        videos: true,
      },
      where: whereFilters,
    });

    const response = NextResponse.json({
      data: {
        listingCars,
      },
    });
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "server error" }, { status: 500 });
  }
};
