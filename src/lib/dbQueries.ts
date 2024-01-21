import { prisma } from "@/lib/prismaClient";
import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
interface ChatCreateInput {
  users: { connect: { id: string }[] };
  messages?: Prisma.MessageCreateNestedManyWithoutChatInput;
  createdAt: Date;
  updatedAt: Date;
}

export const getFeaturedCars = async () => {
  const featuredCars = await prisma.listingCars.findMany({
    where: { featured: true },
    include: {
      CarsMakers: true,
      CarsModels: true,
      damage: true,
      images: true,
      videos: true,
    },
  });
  return featuredCars;
};

export const getLatestCars = async () => {
  const latestCars = await prisma.listingCars.findMany({
    include: {
      CarsMakers: true,
      CarsModels: true,
      damage: true,
      images: true,
      videos: true,
    },
    take: 3,
  });

  // Reverse the order of the retrieved cars
  const latestThreeCars = latestCars.reverse();

  return latestThreeCars;
};
export const getCar = async (id: string) => {
  const car = await prisma.listingCars.findUnique({
    where: { id },
    include: {
      CarsMakers: true,
      CarsModels: true,
      damage: true,
      images: true,
      videos: true,
      owner: true,
    },
  });
  return car;
};

export const getUserCars = async (id: string) => {
  const userCars = await prisma.listingCars.findMany({
    where: {
      ownerId: id,
    },
    include: {
      CarsMakers: true,
      CarsModels: true,
      damage: true,
      images: true,
      videos: true,
    },
  });
  return userCars;
};

export const getCars = async () => {
  try {
    const ListingCars = await prisma.listingCars.findMany({
      include: {
        CarsMakers: true,
        CarsModels: true,
        damage: true,
        images: true,
        videos: true,
      },
    });
    return ListingCars;
  } catch (error) {
    console.log(error);
  }
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

export const updateUser = async (id: string, userData: {}) => {
  try {
    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return { message: "User not found" };
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id },
      data: userData,
    });

    return { message: "User updated successfully", User: updatedUser };
  } catch (error) {
    console.error(error);
    return { message: "Internal server error" };
  }
};

export const getShops = async () => {
  try {
    const shops = await prisma.repairShops.findMany({
      include: {
        images: true,
      },
    });
    return shops;
  } catch (error) {
    console.log(error);
  }
};

export const getShop = async (id: string) => {
  const shop = await prisma.repairShops.findUnique({
    where: { id: id },
    include: {
      images: true,
    },
  });

  return shop;
};

export const deleteShop = async (id: string) => {
  const deleteShop = await prisma.repairShops.delete({ where: { id } });
  return deleteShop;
};
