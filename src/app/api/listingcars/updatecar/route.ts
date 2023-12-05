import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export const PATCH = async (req: NextRequest, context: any) => {
    const { carId } = context.params;
    const body = await req.json();
  
    if (!carId) {
      return NextResponse.json({ message: "Missing car Id" }, { status: 400 });
    }
  
    try {
      const existingCar = await prisma.listingCars.findUnique({
        where: { id: carId as string },
      });
  
      if (!existingCar) {
        return NextResponse.json({ message: "Car not found" }, { status: 404 });
      }
  
      const updatedCar = await prisma.listingCars.update({
        where: { id: carId as string },
        data: body,
      });
  
      return NextResponse.json(
        {
          message: "Car data updated successfully",
          car: updatedCar,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  };
  
