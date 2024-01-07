"use client";

import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CldImage, getCldVideoUrl } from "next-cloudinary";
import { FullCar, Session } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsCashCoin } from "react-icons/bs";
import { IoLocation } from "react-icons/io5";
import { CarsImages, CarsVideos } from "@prisma/client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

type Props = {
  car: FullCar | null;
  session: Session | null;
};

type Media = {
  type: "video" | "image";
  id: string;
  links: string;
  createdAt: Date;
  updatedAt: Date;
  listingCarsId: string | null;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CarDetails = ({ car, session }: Props) => {
  const [videoSorce, setVideoSorce] = useState<CarsVideos[]>([]);
  const [combinedMedia, setCombinedMedia] = useState<Media[]>([]);
  console.log(car);

  const router = useRouter();
  const userId = session?.user.id;
  console.log(car);

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
      if (res.status === 200) {
        const chatId = await res.data.Chat;

        router.push(`/profile/chat/${chatId}`);
      } else {
        toast({
          variant: "destructive",
          description: "حدث خطأ ما",
        });
      }
    } else {
      toast({
        variant: "destructive",
        description: "حدث خطأ ما",
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
  useEffect(() => {
    if (car) {
      const videoSources = car.videos?.map((video) =>
        getCldVideoUrl({
          width: 960,
          height: 600,
          src: video.links as string,
        })
      );

      const updatedVideos: Media[] = Array.isArray(car.videos)
        ? car.videos.map((video, index) => ({
            ...video,
            links: videoSources?.[index] || video.links,
            type: "video",
          }))
        : [];
      setVideoSorce(updatedVideos);

      // Combine images and updated videos arrays into one
      const combined: any = [
        ...(car.images.map((image) => ({ ...image, type: "image" })) || []),
        ...updatedVideos,
      ];
      setCombinedMedia(combined);
    }
  }, [car]);

  console.log(videoSorce);

  return (
    <div className="bg-white">
      <div className="py-10 px-32 max-sm:p-12">
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

        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-12 max-lg:gap-2">
            <Tab.Group
              as="div"
              className="flex flex-row items-start justify-center p-4 max-xl:p-2 max-xl:flex-col gap-6 "
            >
              <Tab.Panels className="overflow-hidden">
                {combinedMedia.map((media) => (
                  <Tab.Panel key={media.id}>
                    {media.type === "image" && (
                      <CldImage
                        width={500}
                        height={500}
                        src={media.links}
                        alt=""
                        className="object-contain object-center sm:rounded-lg w-[700px] max-h-[400px]"
                      />
                    )}
                    {media.type === "video" && (
                      <video
                        width={500}
                        height={500}
                        controls
                        className="object-contain object-center sm:rounded-lg w-[700px] max-h-[400px]"
                      >
                        <source src={media.links} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                  </Tab.Panel>
                ))}
              </Tab.Panels>

              {/* Image selector */}
              <Tab.List className="grid gap-4 grid-cols-2 grid-rows-auto max-xl:flex flex-wrap">
                {combinedMedia.map((media) => (
                  <Tab
                    key={media.id}
                    className="relative flex items-center justify-center h-[200px] w-[200px] cursor-pointer rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 max-lg:h-[100px] max-lg:w-[100px] max-sm:w-[50px] max-sm:h-[50px]"
                  >
                    {media.type === "image" && (
                      <CldImage
                        src={media.links}
                        width={200}
                        height={200}
                        unoptimized={false}
                        alt=""
                        className="object-contain object-center sm:rounded-lg w-[200px] h-[200px] max-xl:[100px] max-xl:[100px]"
                      />
                    )}
                    {media.type === "video" && (
                      <video
                        width={200}
                        height={200}
                        controls
                        className="object-contain object-center sm:rounded-lg w-[200px] h-[200px] max-xl:[100px] max-xl:[100px]"
                      >
                        <source src={media.links} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}
                    {/* Other selected styles */}
                  </Tab>
                ))}
              </Tab.List>
            </Tab.Group>

            {/* Product info */}
            <div className="flex justify-center items-start gap-32 p-2 max-lg:flex-col-reverse max-lg:gap-14">
              <div className="w-[50%] max-lg:w-full">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {car?.title}
                </h1>

                <div className="mt-4">
                  <h3 className="sr-only">Description</h3>
                  <div
                    className="space-y-6 text-base text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: car?.offerDetails || " ",
                    }}
                  />
                </div>

                <section aria-labelledby="details-heading" className="mt-4">
                  <h2 id="details-heading" className="sr-only">
                    Additional details
                  </h2>

                  <span className="flex gap-2 items-center">
                    <span className="text-green-400 text-4xl">
                      {/* <FaCarSide /> */}
                    </span>
                    <h1 className="text-gray-900 text-xl">تفاصيل السيارة</h1>
                  </span>

                  <div className="my-4">
                    <div className="grid grid-cols-4 grid-rows-auto gap-10 mt-2 max-xl:grid-cols-2 border rounded border-2 p-4 items-center justify-center">
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
                    <Accordion type="single" collapsible>
                      <AccordionItem value="item-1">
                        <AccordionTrigger>
                          <h1 className="text-gray-900 text-xl">الصدمات </h1>
                        </AccordionTrigger>
                        {car?.damage.map((describtion, idx) => (
                          <AccordionContent key={idx}>
                            {describtion.description}{" "}
                          </AccordionContent>
                        ))}
                      </AccordionItem>
                    </Accordion>
                  </div>
                </section>
              </div>

              <div className="bg-gray-100 w-[25rem] max-sm:w-[100%] h-[max-content] px-14 py-6 rounded flex flex-col items-start ">
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
    </div>
  );
};

export default CarDetails;
