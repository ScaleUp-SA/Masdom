import CarDetails from "@/components/carDetails";
import { getCar } from "@/lib/dbQueries";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { FullCar } from "@/types";

type Props = {
  params: { carId: string };
};

const page = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const car: FullCar | null = await getCar(params.carId);

  return (
    <div>
      <CarDetails car={car} session={session} />
    </div>
  );
};

export default page;
