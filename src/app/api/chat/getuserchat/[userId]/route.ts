import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
export const GET = async (req: NextRequest, context: any) => {
  const { userId } = context.params;

  if (!userId) {
    return NextResponse.json({ message: "Missing user ID" }, { status: 400 });
  }

  try {
    const userChats = await prisma.user.findUnique({
      where: { id: userId as string },
      include: {
        chats: {
          include: {
            users: {
              select: {
                id: true,
                username: true,
                email: true,
                isAdmin: true,
              },
            },
            messages: {
              select: { id: true, chatId: true, content: true, senderId: true },
            },
          },
        },
      },
    });

    if (!userChats) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User chats fetched successfully",
        chats: userChats.chats,
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
