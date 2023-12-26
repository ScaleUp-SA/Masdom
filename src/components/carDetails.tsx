"use client";

import React from "react";
import { Disclosure, Tab } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CldImage } from "next-cloudinary";
import { FullCar, Session } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsCashCoin } from "react-icons/bs";
import { IoLocation } from "react-icons/io5";

type Props = {
  car: FullCar | null;
  session: Session | null;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CarDetails = ({ car, session }: Props) => {
  const router = useRouter();
  const userId = session?.user.id;

  const { toast } = useToast();

  const chatHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (car?.ownerId && userId) {
      const res = await axios.post("/api/chat/create", {
        userId1: car.ownerId,
        userId2: userId,
      });
      console.log(car.ownerId, userId);
      if (res.status === 200) {
        const chatId = await res.data.Chat;

        router.push(`/profile/chat/${chatId}`);
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      }
      console.log(res, "chat");
    } else {
      toast({
        variant: "destructive",
        title: "Missing Id",
        description: "One of the users Id are Missing",
      });
      return;
    }
  };
  const deleteHandler = async () => {
    if (car?.id) {
      const res = await axios.delete("/api/listingcars/delete", {
        data: { id: car.id },
      });
      if (res.status === 200) {
        router.push(`/`);
        toast({
          variant: "destructive",
          description: "تم حذف السيارة ",
        });
      }
    }
  };

  const featureHandler = async () => {
    if (car?.id) {
      const res = await axios.put("/api/listingcars/update/featured", {
        id: car.id,
        featured: !car.featured,
      });
      if (res.status === 200) {
        router.push(`/`);
        toast({
          description: "تم تمميز السيارة ",
        });
      }
    }
  };

  const editHandler = async () => {
    if (car?.id) {
      router.push(`/cars/${car.id}/edit`);
    }
  };

  return (
    <div className="bg-white">
      <div className="p-10 max-sm:p-4">
        {session?.user.isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger className=" rounded-md shadow-2xl p-2 mb-2 hover:bg-gray-300 ">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
                />
              </svg>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" flex flex-col justify-end items-end">
              <DropdownMenuItem
                onClick={editHandler}
                className=" cursor-pointer w-full flex justify-end"
              >
                <span>تعديل</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={featureHandler}
                className=" cursor-pointer w-full flex justify-end"
              >
                <span className=" ">
                  {car?.featured === false ? "تمييز" : "ايقاف التمميز"}
                </span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={deleteHandler}
                className=" cursor-pointer w-full flex justify-end"
              >
                <span className=" text-red-600">حذف</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        <div className="flex flex-col gap-12 max-lg:gap-2">
          <Tab.Group
            as="div"
            className="flex flex-row items-start justify-evenly p-4 max-xl:p-2 max-xl:flex-col gap-6 "
          >
            <Tab.Panels className="overflow-hidden ">
              {car?.images.map((image) => (
                <Tab.Panel key={image.id}>
                  <CldImage
                    width={500}
                    height={500}
                    src={image.links}
                    alt={""}
                    className="object-contain object-center sm:rounded-lg w-[700px] max-h-[400px]"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>

            {/* Image selector */}
            <Tab.List className="grid gap-4 grid-cols-2 grid-rows-auto max-xl:flex flex-wrap">
              {car?.images.map((image) => (
                <Tab
                  key={image.id}
                  className="relative flex items-center justify-center h-[200px] w-[200px] cursor-pointer rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 max-lg:h-[100px] max-lg:w-[100px] max-sm:w-[50px] max-sm:h-[50px]"
                >
                  {({ selected }) => (
                    <>
                      <span className="absolute inset-0 overflow-hidden rounded-md flex items-center justify-center">
                        <CldImage
                          src={image.links}
                          width={200}
                          height={200}
                          unoptimized={false}
                          alt={""}
                          className="object-contain object-center sm:rounded-lg w-[200px] h-[200px] max-xl:[100px] max-xl:[100px]"
                        />
                      </span>
                      <span
                        className={classNames(
                          selected ? "ring-green-500" : "ring-transparent",
                          "pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2"
                        )}
                        aria-hidden="true"
                      />
                    </>
                  )}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>

          {/* Product info */}
          <div className="flex justify-between gap-4 p-2 max-lg:flex-col-reverse">
            <div className="w-[50%] max-lg:w-full">
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                {car?.title}
              </h1>

              <div className="mt-4">
                <h3 className="sr-only">Description</h3>
                <div
                  className="space-y-6 text-base text-gray-700"
                  dangerouslySetInnerHTML={{ __html: car?.offerDetails || " " }}
                />
              </div>

              <section aria-labelledby="details-heading" className="mt-6">
                <h2 id="details-heading" className="sr-only">
                  Additional details
                </h2>

                <span className="flex gap-2 items-center">
                  <span className="text-green-400 text-4xl">
                    {/* <FaCarSide /> */}
                  </span>
                  <h1 className="text-gray-900 text-xl">تفاصيل السيارة</h1>
                </span>

                <div className="my-6">
                  <div className="grid grid-cols-4 grid-rows-auto gap-8 mt-2 max-md:grid-cols-2 border rounded border-2 p-4 items-center justify-center">
                    <div className="flex flex-col w-[max-content] gap-2  justify-between">
                      <p className=" font-bold text-lg  "> الصانع </p>{" "}
                      {car?.CarsMakers?.name}
                    </div>

                    <div className="flex flex-col w-[max-content] gap-2  justify-between">
                      <span className=" font-bold text-lg">الموديل </span>{" "}
                      {car?.CarsModels?.name}
                    </div>

                    <div className="flex flex-col w-[max-content] gap-2  justify-between">
                      <span className=" font-bold text-lg">اللون</span>{" "}
                      {car?.color}{" "}
                    </div>

                    <div className="flex flex-col w-[max-content]  gap-2 justify-between">
                      <span className=" font-bold text-lg">الشكل</span>{" "}
                      {car?.shape}{" "}
                    </div>

                    <div className="flex flex-col w-[max-content] gap-2   justify-between">
                      <span className=" font-bold text-lg">الفئة</span>{" "}
                      {car?.carClass}{" "}
                    </div>

                    <div className="flex flex-col w-[max-content] gap-2   justify-between">
                      <span className=" font-bold text-lg">سنة الانشاء</span>
                      {car?.year}{" "}
                    </div>

                    <div className="flex flex-col w-[max-content] gap-2   justify-between">
                      <span className=" font-bold text-lg">الانتقالات</span>{" "}
                      {car?.transmission}{" "}
                    </div>

                    <div className="flex  flex-col w-[max-content] gap-2  justify-between">
                      <span className=" font-bold text-lg">الكيلومترات</span>{" "}
                      {car?.mileage}{" "}
                    </div>

                    <div className="flex flex-col w-[max-content]  gap-2  justify-between">
                      <span className=" font-bold text-lg">السليندرات</span>{" "}
                      {car?.cylinders}{" "}
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="bg-gray-100 w-[30%] h-[max-content] p-4 rounded flex flex-col items-start max-lg:w-full ">
              <div className="flex gap-4 text-3xl justify-center items-center">
                <IoLocation />
                <span className="text-sm">
                  <p className="text-gray-600">الموقع</p>
                  <p>{`${car?.country}, ${car?.city}`}</p>
                </span>
              </div>
              <div className="flex gap-4 text-3xl justify-center mt-4 items-center">
                <BsCashCoin />
                <span className="text-sm">
                  <p className="text-gray-600">السعر</p>
                  <p className="text-xl">{`${car?.price} ريال`}</p>
                </span>
              </div>

              <form className="w-full">
                <div className="mt-4 flex flex-col">
                  <Button
                    type="submit"
                    className="flex m-1 max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                  >
                    شراء{" "}
                  </Button>
                  {session?.user.id !== car?.ownerId && (
                    <Button
                      onClick={(e) => chatHandler(e)}
                      type="submit"
                      className="flex m-1 max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-green-600 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                    >
                      تحدث مع البائع{" "}
                    </Button>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
