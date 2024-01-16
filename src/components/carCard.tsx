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
      className="flex flex-col items-center border-2 border-solid rounded-xl cursor-pointer min-w-[20rem] max-w-[25rem] h-[30rem] max-sm:flex-row max-sm:min-w-full max-sm:h-[11rem] max-sm:gap-2"
    >
      <div className="flex items-center justify-center w-[full] h-[50%] rounded-t-xl mb-2 max-sm:h-[100%] max-sm:w-[40%] max-sm:rounded-r-xl max-sm:rounded-tl-none max-sm:mb-0">
        <CldImage
          alt={"image"}
          src={carData?.images[0]?.links}
          width={500}
          height={500}
          className="rounded-t-xl object-cover object-center h-[100%] max-sm:rounded-r-xl max-sm:rounded-tl-none"
        />
      </div>
      <div className="h-[50%] flex flex-col justify-evenly w-full p-2 max-sm:h-full max-sm:w-[60%] max-sm:justify-between max-sm:gap-2 max-sm:py-4">
        <div className="w-full h-16 overflow-hidden max-sm:h-20">
          <h1 className="text-xl text-sky-900 max-sm:text-lg">{carData.title}</h1>
        </div>
        <div className="flex items-center justify-evenly  border-b-2 border-solid border-slate-100 max-sm:border-none max-sm:items-start">
          <div className="flex flex-col justify-center items-center gap-1 text-slate-500 w-[50%] max-sm:flex-row max-sm:justify-start max-sm:text-xs  max-sm:w-[60%]">
            <IoSpeedometerOutline />
            <p>{carData.mileage} كم</p>
          </div>
          <span className="bg-slate-100 h-12 w-[2px] mb-2 max-sm:hidden"></span>
          <div className="flex flex-col justify-center items-center gap-1 text-slate-500 w-[50%] max-sm:flex-row max-sm:justify-start max-sm:text-xs max-sm:w-[40%]">
            <CiCalendarDate />
            <p>{carData.year}</p>
          </div>
        </div>
        <div className="flex justify-between max-sm:mt-2">
          {carData.price === 0 ? (
            <p className="text-slate-500">
              <span className="text-green-500 ml-2 text-xl max-sm:text-lg">{"علي السوم"}</span>{" "}
            </p>
          ) : (
            <p className="text-slate-500">
              <span className="text-green-500 ml-2 text-xl max-sm:text-lg">{carData.price}</span>{" "}
              ريال
            </p>
          )}

          <span className="flex items-center gap-2 max-sm:hidden">
            <p className="text-sky-900 ">عرض التفاصيل</p>
            <IoIosArrowBack className="text-slate-500" />
          </span>
        </div>
      </div>

    </div>
  );
};

export default CarCard;
