import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { prisma } from "@/lib/prismaClient";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const { id: carId } = await req.json();

    if (!session) {
      return NextResponse.json({ message: "token not valid" }, { status: 401 });
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isAdmin) {
      const deletedCar = await prisma.listingCars.delete({
        where: { id: carId },
      });
      if (!deletedCar) {
        return NextResponse.json(
          { message: "Listing car not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Listing car deleted successfully" },
        { status: 200 }
      );
    } else {
      const listingCar = await prisma.listingCars.findUnique({
        where: { id: carId },
      });
      if (!listingCar || listingCar.ownerId !== user.id) {
        return NextResponse.json({ message: "Forbidden" }, { status: 403 });
      }

      const deletedCar = await prisma.listingCars.delete({
        where: { id: carId },
      });
      return NextResponse.json(
        { message: "Listing car deleted successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
