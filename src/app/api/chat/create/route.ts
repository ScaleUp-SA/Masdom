import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {
  try {
    const { userId1, userId2 } = await req.json();

    if (!userId1 || !userId2) {
      return NextResponse.json({ message: "Missing user ID" }, { status: 400 });
    }

    const chatData = {
      users: { connect: [{ id: userId1 }, { id: userId2 }] },
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [user1Chats, user2Chats] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId1 },
        include: { chats: true },
      }),
      prisma.user.findUnique({
        where: { id: userId2 },
        include: { chats: true },
      }),
    ]);

    if (!user1Chats || !user2Chats) {
      return NextResponse.json(
        { message: "One or both users not found" },
        { status: 400 }
      );
    }

    const commonChat = user1Chats.chats.find((chat1) =>
      user2Chats.chats.some((chat2) => chat2.id === chat1.id)
    );

    if (commonChat) {
      return NextResponse.json(
        { message: "Conversation found", Chat: commonChat.id },
        { status: 200 }
      );
    } else {
      const chat = await prisma.chat.create({ data: chatData });

      return NextResponse.json(
        { message: "Conversation created", chat },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
