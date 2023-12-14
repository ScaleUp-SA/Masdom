import CarDetails from "@/components/carDetails";
import { getCar } from "@/lib/dbQueries";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";

type Props = {
  params: { carId: string };
};

const page = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const car = await getCar(params.carId);

  console.log(car);

  return (
    <div>
      <CarDetails car={car} currentUserId={session?.user.id} />
    </div>
  );
};

export default page;
