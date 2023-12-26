import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const makes = await prisma.carsMakers.findMany();
    const models = await prisma.carsModels.findMany();
    const colors = await prisma.listingCars.findMany({
      distinct: ["color"],
      select: {
        color: true,
      },
    });
    const cities = await prisma.listingCars.findMany({
      distinct: ["city"],
      select: {
        city: true,
      },
    });
    const countries = await prisma.listingCars.findMany({
      distinct: ["country"],
      select: {
        country: true,
      },
    });
    const shapes = await prisma.listingCars.findMany({
      distinct: ["shape"],
      select: {
        shape: true,
      },
    });
    const transmissions = await prisma.listingCars.findMany({
      distinct: ["transmission"],
      select: {
        transmission: true,
      },
    });
    const years = await prisma.listingCars.findMany({
      distinct: ["year"],
      select: {
        year: true,
      },
    });
    const prices = await prisma.listingCars.findMany({
      distinct: ["price"],
      select: {
        price: true,
      },
    });

    res.json({
      makes,
      models,
      colors,
      cities,
      countries,
      shapes,
      transmissions,
      years,
      prices,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
