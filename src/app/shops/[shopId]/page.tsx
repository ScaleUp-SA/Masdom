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
  console.log("params.shopId", params.shopId);

  const shop = await getShop(params.shopId);
  console.log(shop, "shop");

  return (
    <div>
      <ShopDetails shop={shop} session={session} />
    </div>
  );
};

export default Page;
