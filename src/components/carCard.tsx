"use client";

import { CiCalendarDate } from "react-icons/ci";
import { IoSpeedometerOutline } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";
import { CldImage } from "next-cloudinary";
import { FullCar } from "@/types";

const CarCard = ({ carData }: { carData: FullCar }) => {
  const router = useRouter();
  const routeHandler = () => {
    router.push(`/cars/${carData.id}`);
  };

  return (
    <div
      onClick={routeHandler}
      className="flex flex-col justify-between border-2 border-solid gap-4 rounded-xl pb-6 cursor-pointer min-w-[20rem] max-w-[25rem] max-sm:min-h-[max-content]"
    >
      <div className="w-[full] h-[300px] rounded-t-xl mb-2">
        <CldImage
          alt={"image"}
          src={carData?.images[0]?.links}
          width={500}
          height={500}
          className="rounded-t-xl object-cover object-center sm:rounded-t-lg h-[100%]"
        />
      </div>
      <div className="px-5">
        <h1 className="text-2xl text-sky-900">{carData.title}</h1>
      </div>
      <div className="flex items-center justify-evenly p-3 border-b-2 border-solid border-slate-100">
        <div className="flex flex-col justify-center items-center gap-1 text-slate-500">
          <IoSpeedometerOutline />
          <p>{carData.mileage} كم</p>
        </div>
        <span className="bg-slate-100 h-12 w-[2px]"></span>
        <div className="flex flex-col justify-center items-center gap-1 text-slate-500">
          <CiCalendarDate />
          <p>{carData.year}</p>
        </div>
      </div>
      <div className="flex justify-between px-5">
        {carData.price === 0 ? (
          <p className="text-slate-500">
            <span className="text-green-500 ml-2 text-xl">{"علي السوم"}</span>{" "}
          </p>
        ) : (
          <p className="text-slate-500">
            <span className="text-green-500 ml-2 text-xl">{carData.price}</span>{" "}
            ريال
          </p>
        )}

        <span className="flex items-center gap-2">
          <p className="text-sky-900 ">عرض التفاصيل</p>
          <IoIosArrowBack className="text-slate-500" />
        </span>
      </div>
    </div>
  );
};

export default CarCard;
