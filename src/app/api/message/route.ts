import { prisma } from "@/lib/prismaClient";
import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";

export async function POST(req: NextRequest) {
  try {
    const { chatId, content, sender } = await req.json();

    if (!sender || !content || !chatId) {
      return NextResponse.json(
        { message: "Missing required data" },
        { status: 400 }
      );
    }

    const messageData = {
      content,
      sender: {
        connect: {
          id: sender,
        },
      },
      chat: {
        connect: {
          id: chatId,
        },
      },
    };

    const message = await prisma.message.create({
      data: messageData,
    });

    await pusherServer.trigger(chatId, "message", message);

    return NextResponse.json(
      { message: "Message created", data: message },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
