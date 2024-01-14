import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, context: any) => {
  const { chatId } = context.params;

  if (!chatId) {
    return NextResponse.json({ message: "Missing chat ID" }, { status: 400 });
  }

  try {
    const chatData = await prisma.chat.findUnique({
      where: { id: chatId as string },
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
    });

    if (!chatData) {
      return NextResponse.json({ message: "Chat not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "Chat data fetched successfully",
        chat: chatData,
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
