import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export const POST = async function handler(
  req: NextRequest,
  res: NextResponse
) {
  try {
    const { name, phoneNumber, country, city, ShopsImages, cars } =
      await req.json();

    if (!ShopsImages) {
      return NextResponse.json(
        { message: "shops images not exsisting" },
        { status: 400 }
      );
    }

    if (!cars) {
      return NextResponse.json(
        { message: "cars not exsisting" },
        { status: 400 }
      );
    }

    // Create the new listing car
    const newListingCar = await prisma.repairShops.create({
      data: {
        name,
        country,
        phoneNumber: phoneNumber,
        city,
        cars: cars,
        images: {
          createMany: {
            data: ShopsImages || [],
          },
        },
      },
      include: {
        images: true,
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
