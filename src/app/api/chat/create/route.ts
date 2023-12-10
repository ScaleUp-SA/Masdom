import { Prisma, PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

interface ChatCreateInput {
  users: { connect: { id: string }[] };
  messages?: Prisma.MessageCreateNestedManyWithoutChatInput;
  createdAt: Date;
  updatedAt: Date;
}

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const { userId1, userId2 } = await req.json();

  if (!userId1 || !userId2) {
    return NextResponse.json({ message: "Missing user ID" });
  }

  const chatData: ChatCreateInput = {
    users: { connect: [{ id: userId1 }, { id: userId2 }] },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const user1Chats = await prisma.user.findUnique({
    where: { id: userId1 },
    include: { chats: true },
  });

  const user2Chats = await prisma.user.findUnique({
    where: { id: userId1 },
    include: { chats: true },
  });

  try {
    if (!user1Chats || !user2Chats) {
      throw new Error("One or both users not found");
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
      const chat = await prisma.chat.create({
        data: chatData,
      });

      return NextResponse.json(
        { message: "Conversation created", chat },
        { status: 200 }
      );
    }
    // create a new chat
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
