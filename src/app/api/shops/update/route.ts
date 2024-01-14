import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export const PUT = async function (req: NextRequest, res: NextResponse) {
  try {
    const {
      shopId,
      name,
      city,
      country,
      cars,
      images, // Assuming this will contain an array of image links
    } = await req.json();

    // Use the shopId to identify the specific car data to update
    const updatedShop = await prisma.repairShops.update({
      where: {
        id: shopId,
      },
      data: {
        name,
        city,
        country,
        cars: { set: cars }, // Update the 'cars' field
        // Update other fields as needed
        images: { set: images }, // Update the 'images' field
      },
    });

    return NextResponse.json(
      { message: "Updated car data", data: updatedShop },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
};
