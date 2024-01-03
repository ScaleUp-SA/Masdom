import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { prisma } from "@/lib/prismaClient";

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  try {
    const { id: shopId } = await req.json();

    if (!session) {
      return NextResponse.json(
        { message: "session not valid" },
        { status: 401 }
      );
    }
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.isAdmin) {
      const deletedShop = await prisma.repairShops.delete({
        where: { id: shopId },
      });

      if (!deletedShop) {
        return NextResponse.json(
          { message: "Listing shop not found" },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { message: "Listing shop deleted successfully" },
        { status: 200 }
      );
    } else {
      const listingShop = await prisma.repairShops.findUnique({
        where: { id: shopId },
      });

      const deletedShop = await prisma.repairShops.delete({
        where: { id: shopId },
      });
      return NextResponse.json(
        { message: "Listing shop deleted successfully" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
