import { getShop } from "@/lib/dbQueries";
import React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import ShopDetails from "@/components/shopDetails";

type Props = {
  params: { shopId: string };
};

const Page = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const shop = await getShop(params.shopId);

  return (
    <div>
      <ShopDetails shop={shop} session={session} />
    </div>
  );
};

export default Page;
