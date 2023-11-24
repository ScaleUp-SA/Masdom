import React from "react";
import imageCar from "../../../../public/images/car.jpg";
import Image from "next/image";
import { CiCalendarDate } from "react-icons/ci";
import { IoSpeedometerOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";

const index = () => {
  return (
    <div className="flex flex-col gap-5 border-2 border-solid rounded-xl pb-5 cursor-pointer">
      <div>
        <Image
          src={imageCar}
          alt="Car"
          width={400}
          height={300}
          className="rounded-t-xl"
        />
      </div>
      <div className="px-5">
        <h1 className="text-2xl text-sky-900">تيوتا يارىس</h1>
      </div>
      <div className="flex items-center justify-evenly p-3 border-b-2 border-solid border-slate-100">
        <div className="flex flex-col justify-center items-center gap-1 text-slate-500">
          <IoSpeedometerOutline />
          <p>15000</p>
        </div>
        <div className="flex flex-col justify-center items-center gap-1 text-slate-500">
          <CiCalendarDate />
          <p>2022</p>
        </div>
      </div>
      <div className="flex justify-between px-5">
        <p className="text-slate-500">
          <span className="text-green-500 ml-2">0</span> ريال
        </p>
        <span className="flex items-center gap-2">
          <p className="text-sky-900 ">عرض التفاصيل</p>
          <IoIosArrowBack className="text-slate-500" />
        </span>
      </div>
    </div>
  );
};

export default index;
