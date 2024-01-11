import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient()
export const GET = async (req: NextRequest, res: NextResponse) => {
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

    const filters = [
      {
        id: "maker",
        name: "الماركة",
        options: makes.map((make) => ({
          value: make.name,
          label: make.name,
        })),
      },
      {
        id: "model",
        name: "الموديل",
        options: models.map((model) => ({
          value: model.name,
          label: model.name,
        })),
      },
      {
        id: "color",
        name: "اللون",
        options: colors.map((color) => ({
          value: color.color,
          label: color.color,
        })),
      },
      {
        id: "city",
        name: "المدينة",
        options: cities.map((city) => ({
          value: city.city,
          label: city.city,
        })),
      },
      {
        id: "country",
        name: "الدولة",
        options: countries.map((country) => ({
          value: country.country,
          label: country.country,
        })),
      },
      {
        id: "shape",
        name: "الشكل",
        options: shapes.map((shape) => ({
          value: shape.shape,
          label: shape.shape,
        })),
      },
      {
        id: "transmission",
        name: "القير",
        options: transmissions.map((transmission) => ({
          value: transmission.transmission,
          label: transmission.transmission,
        })),
      },
      {
        id: "year",
        name: "سنة الصنع",
        options: years.map((year) => ({
          value: year.year,
          label: year.year,
        })),
      },
      {
        id: "price",
        name: "السعر",
        options: prices.map((price) => ({
          value: price.price,
          label: price.price,
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
