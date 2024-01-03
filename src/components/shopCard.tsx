"use client";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { FullShop } from "@/types";
import { GrLocationPin } from "react-icons/gr";
import { IoCarSportOutline } from "react-icons/io5";

type Props = {
  shop: FullShop;
};

type ShopCar = string | number | null;

const ShopCard = ({ shop }: Props) => {
  const router = useRouter();
  const routeHandler = () => {
    router.push(`/shops/${shop.id}`);
  };

  const renderCarDetails = () => {
    if (!Array.isArray(shop?.cars) || shop.cars === null) return null;

    const carsArray = shop.cars as ShopCar[];

    return carsArray.map((car: ShopCar, idx: number) => {
      if (typeof car === "string" || typeof car === "number" || car === null) {
        const isLastCar = idx === carsArray.length - 1;

        return (
          <span key={idx}>
            <p>
              {car ?? ""}
              {!isLastCar && (
                <span className="text-[#31c77f] font-bold pl-1">, </span>
              )}
            </p>
          </span>
        );
      }

      return null;
    });
  };

  return (
    <div
      onClick={routeHandler}
      className="flex flex-col justify-between border-2 border-solid gap-4 rounded-xl pb-6 cursor-pointer min-w-[20rem] max-w-[25rem] max-sm:min-h-[max-content]"
    >
      <div className="w-[full] h-[300px] rounded-t-xl mb-2">
        <CldImage
          alt={"image"}
          src={shop?.images?.[0]?.links}
          width={500}
          height={500}
          className="rounded-t-xl object-cover object-center sm:rounded-t-lg h-[100%]"
        />
      </div>
      <div className="px-5">
        <h1 className="text-2xl text-sky-900">{shop.name}</h1>
      </div>
      <div className="flex items-center justify-evenly p-3 border-b-2 border-solid border-slate-100">
        <div className="flex flex-col justify-center items-center gap-1 text-slate-500">
          <span className="text-[#31c77f] text-2xl">
            <GrLocationPin />
          </span>
          <p className="w-full justify-center p-0 m-0">
            {shop.country}
            <span className="text-[#31c77f] font-bold">, </span>
            {shop.city}
          </p>
        </div>
        <span className="bg-slate-100 h-12 w-[2px]"></span>
        <div className="flex flex-col justify-center items-center gap-1 text-slate-500">
          <span className="text-[#31c77f] text-2xl">
            <IoCarSportOutline />
          </span>{" "}
          <div className="flex">{renderCarDetails()}</div>
        </div>
      </div>
      <div className="flex justify-end px-5">
        <span className="flex items-center gap-2">
          <p className="text-sky-900">عرض التفاصيل</p>
          <IoIosArrowBack className="text-slate-500" />
        </span>
      </div>
    </div>
  );
};

export default ShopCard;
