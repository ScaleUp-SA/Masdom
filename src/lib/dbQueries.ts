import { prisma } from "@/lib/prismaClient";
import { Prisma } from "@prisma/client";

interface ChatCreateInput {
  users: { connect: { id: string }[] };
  messages?: Prisma.MessageCreateNestedManyWithoutChatInput;
  createdAt: Date;
  updatedAt: Date;
}

export const getFeaturedCars = async () => {
  const featuredCars = await prisma.listingCars.findMany({
    where: { featured: true },
  });

  return featuredCars;
};

export const getLatestCars = async () => {
  const latestCars = await prisma.listingCars.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return latestCars;
};

export const getCar = async (id: string) => {
  const car = await prisma.listingCars.findUnique({
    where: { id },
    include: {
      CarsMakers: true,
      CarsModels: true,
      Damage: true,
    },
  });
  return car;
};

export const createChat = async (
  userId1: string | undefined,
  userId2: string | undefined
) => {
  if (!userId1 || !userId2) {
    return { message: "Missing user ID" };
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
      const res = { message: "Conversation found", Chat: commonChat.id };
      return res;
    } else {
      const chat = await prisma.chat.create({
        data: chatData,
      });
      const res = { message: "Conversation created", Chat: chat.id };
      return res;
    }
  } catch (error) {
    console.error(error);
    const res = { message: "Internal server error" };
    return res;
  }
};
