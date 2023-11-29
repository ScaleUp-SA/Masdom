import { prisma } from "@/lib/prismaClient";

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
