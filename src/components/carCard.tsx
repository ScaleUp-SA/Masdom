"use client";

import React, { useEffect, useState } from "react";
import { CiCalendarDate } from "react-icons/ci";
import { IoSpeedometerOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { ListingCars } from "@prisma/client";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";

const imageUrl = "https://ucarecdn.com/093e8474-e3a6-40e5-a7fa-3abcd9042e0c";

const CarCard = ({ carData }: { carData: ListingCars }) => {
  const router = useRouter();
  const [blurImage, setBlurImage] = useState("");
  const routeHandler = () => {
    router.push(`/cars/${carData.id}`);
  };

  return (
    <div
      onClick={routeHandler}
      className="flex flex-col gap-5 border-2 border-solid rounded-xl pb-5 cursor-pointer"
    >
      <div>
        {/* <Image
          src="/car.jpg"
          alt="Car"
          width={400}
          height={300}
          className="rounded-t-xl"
        /> */}
        {/* <UploadcareImage
          alt="Test image"
          src={`${imageUrl}/-/scale_crop/450x300/center/-/enhance/`}
          width={400}
          height={300}
          className="rounded-t-xl"
        /> */}

        <CldImage
          width={400}
          height={300}
          src="swhqw2dad0f7nj8vscsi"
          alt="Test image"
          className="rounded-t-xl"
        />
      </div>
      <div className="px-5">
        <h1 className="text-2xl text-sky-900">{carData.title}</h1>
      </div>
      <div className="flex items-center justify-evenly p-3 border-b-2 border-solid border-slate-100">
        <div className="flex flex-col justify-center items-center gap-1 text-slate-500">
          <IoSpeedometerOutline />
          <p>{carData.mileage}</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-1 text-slate-500">
          <CiCalendarDate />
          <p>{carData.year}</p>
        </div>
      </div>
      <div className="flex justify-between px-5">
        <p className="text-slate-500">
          <span className="text-green-500 ml-2">{carData.price}</span> ريال
        </p>
        <span className="flex items-center gap-2">
          <p className="text-sky-900 ">عرض التفاصيل</p>
          <IoIosArrowBack className="text-slate-500" />
        </span>
      </div>
    </div>
  );
};

export default CarCard;
