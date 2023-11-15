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

  try {
    // create a new chat
    const chat = await prisma.chat.create({
      data: chatData,
    });

    return NextResponse.json(
      { message: "Conversation created", chat },
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
