"use client";

import React from "react";
import { Disclosure, Tab } from "@headlessui/react";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CldImage } from "next-cloudinary";
import { FullCar } from "@/types";

type Props = {
  car: FullCar | null;
  currentUserId: string | undefined;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const CarDetails = ({ car, currentUserId }: Props) => {
  const router = useRouter();

  const { toast } = useToast();

  const chatHandler = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (!car?.ownerId || !currentUserId) {
      toast({
        variant: "destructive",
        title: "Missing Id",
        description: "One of the users Id are Missing",
      });
      return;
    } else {
      const res = await axios.post("/api/chat/create", {
        userId1: car.ownerId,
        userId2: currentUserId,
      });
      const chatId = await res.data.Chat;
      router.push(`/profile/chat/${chatId}`);

      if (!chatId) {
        toast({
          variant: "destructive",
          description: "Something went wrong",
        });
      }
    }
  };
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <Tab.Group as="div" className="flex flex-col-reverse">
            {/* Image selector */}
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <Tab.List className="grid grid-cols-4 gap-6">
                {car?.Images.map((image) => (
                  <Tab
                    key={image.id}
                    className="relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase text-gray-900 hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
                  >
                    {({ selected }) => (
                      <>
                        <span className="absolute inset-0 overflow-hidden rounded-md">
                          <CldImage
                            src={image.Links}
                            width={400}
                            height={400}
                            alt={""}
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
            </div>

            <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
              {car?.Images.map((image) => (
                <Tab.Panel key={image.id}>
                  <CldImage
                    width={400}
                    height={400}
                    src={image.Links}
                    alt={""}
                    className="h-full w-full object-cover object-center sm:rounded-lg"
                  />
                </Tab.Panel>
              ))}
            </Tab.Panels>
          </Tab.Group>

          {/* Product info */}
          <div className="mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {car?.title}
            </h1>

            <div className="mt-3">
              <h2 className="sr-only">Product information</h2>
              <p className="text-3xl tracking-tight text-gray-900">
                {car?.price} <span className=" text-lg font-light"> ريال </span>
              </p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">Description</h3>

              <div
                className="space-y-6 text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: car?.discussion || " " }}
              />
            </div>

            <form className="mt-6">
              <div className="mt-10 flex flex-row-reverse justify-between ">
                <Button
                  type="submit"
                  className="flex m-1 max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-green-600 px-8 py-3 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  شراء{" "}
                </Button>

                <Button
                  onClick={(e) => chatHandler(e)}
                  type="submit"
                  className="flex m-1 max-w-xs flex-1 items-center justify-center rounded-md border border-transparent bg-white px-8 py-3 text-base font-medium text-green-600 hover:bg-green-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-50 sm:w-full"
                >
                  تحدث مع البائع{" "}
                </Button>
              </div>
            </form>

            <section aria-labelledby="details-heading" className="mt-12">
              <h2 id="details-heading" className="sr-only">
                Additional details
              </h2>

              <div className="divide-y divide-gray-200 border-t">
                <Disclosure as="div">
                  {({ open }) => (
                    <>
                      <h3>
                        <Disclosure.Button className="group relative flex w-full items-center justify-between py-6 text-left">
                          <span
                            className={classNames(
                              open ? "text-green-600" : "text-gray-900",
                              "text-sm font-medium"
                            )}
                          >
                            خواص السيارة
                          </span>
                          <span className="ml-6 flex items-center">
                            {open ? (
                              <MinusIcon
                                className="block h-6 w-6 text-green-400 group-hover:text-green-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <PlusIcon
                                className="block h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                aria-hidden="true"
                              />
                            )}
                          </span>
                        </Disclosure.Button>
                      </h3>
                      <Disclosure.Panel
                        as="div"
                        className="prose prose-sm pb-6"
                      >
                        <ul role="list">
                          <li className="flex w-40 justify-between">
                            <p className=" font-bold text-lg  "> الصانع </p>{" "}
                            {car?.CarsMakers?.name}
                          </li>
                          <li className="flex w-40 justify-between">
                            <span className=" font-bold text-lg">الموديل </span>{" "}
                            {car?.CarsModels?.name}
                          </li>
                          <li className="flex w-40 justify-between">
                            <span className=" font-bold text-lg">اللون</span>{" "}
                            {car?.color}{" "}
                          </li>
                          <li className="flex w-40 justify-between">
                            <span className=" font-bold text-lg">الشكل</span>{" "}
                            {car?.shape}{" "}
                          </li>
                          <li className="flex w-40 justify-between">
                            <span className=" font-bold text-lg">الفئة</span>{" "}
                            {car?.class}{" "}
                          </li>
                          <li className="flex w-40 justify-between">
                            <span className=" font-bold text-lg">البلد</span>{" "}
                            {car?.country}{" "}
                          </li>
                          <li className="flex w-40 justify-between">
                            <span className=" font-bold text-lg">المدينة</span>{" "}
                            {car?.city}{" "}
                          </li>
                          <li className="flex w-40 justify-between">
                            <span className=" font-bold text-lg">
                              سنة الانشاء
                            </span>
                            {car?.year}{" "}
                          </li>
                          <li className="flex w-40 justify-between">
                            <span className=" font-bold text-lg">
                              الانتقالات
                            </span>{" "}
                            {car?.transmission}{" "}
                          </li>
                          <li className="flex w-40 justify-between">
                            <span className=" font-bold text-lg">
                              عدد الكيلو مترات
                            </span>{" "}
                            {car?.mileage}{" "}
                          </li>
                          <li className="flex w-40 justify-between">
                            <span className=" font-bold text-lg">
                              عدد السليندرات
                            </span>{" "}
                            {car?.cylinders}{" "}
                          </li>
                        </ul>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
