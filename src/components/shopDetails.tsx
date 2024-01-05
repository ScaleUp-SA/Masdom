"use client";

import React from "react";
import { Tab } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { CldImage } from "next-cloudinary";
import { FullShop, Session } from "@/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaWhatsapp } from "react-icons/fa";

type Props = {
  shop: FullShop | null;
  session: Session | null;
};
type ShopCar = string | number | null;

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const ShopDetails = ({ shop, session }: Props) => {
  const router = useRouter();
  const userId = session?.user.id;

  const { toast } = useToast();

  const deleteHandler = async () => {
    if (shop?.id) {
      const res = await axios.delete("/api/shops/delete", {
        data: { id: shop.id },
      });
      if (res.status === 200) {
        router.push(`/`);
        toast({
          variant: "destructive",
          description: "تم حذف المحل ",
        });
      }
    }
  };

  const editHandler = async () => {
    if (shop?.id) {
      router.push(`/shops/${shop.id}/edit`);
    }
  };

  const renderCarDetails = () => {
    if (!shop) return null;

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
              {/* <DropdownMenuItem
                onClick={featureHandler}
                className=" cursor-pointer w-full flex justify-end"
              >
                <span className=" ">
                  {car?.featured === false ? "تمييز" : "ايقاف التمميز"}
                </span>
              </DropdownMenuItem> */}
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
              <Tab.Panels className="overflow-hidden ">
                {shop?.images.map((image) => (
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
                {shop?.images.map((image) => (
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
            <div className="flex justify-center items-start gap-32 p-2 max-lg:flex-col-reverse max-lg:gap-14">
              <div className="w-[50%] max-lg:w-full">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                  {shop?.name}
                </h1>

                <div className="mt-4">
                  <div
                    className="space-y-6 text-base text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: `${shop?.country}, ${shop?.city} ` || " ",
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
                  </span>

                  <div className="my-4">
                    <div className="grid grid-cols-4 grid-rows-auto gap-10 mt-2 max-xl:grid-cols-2  rounded border-2 p-4 items-center justify-center">
                      <div className="flex flex-col w-[max-content] gap-2  justify-between">
                        <p className=" font-bold text-lg  ">
                          {" "}
                          السيارات المتخصص بها{" "}
                        </p>{" "}
                        {renderCarDetails()}
                      </div>
                    </div>
                  </div>
                </section>
              </div>

              <div className="bg-gray-100 w-[25rem] max-sm:w-[100%] h-[max-content] px-14 py-6 rounded flex flex-col items-start ">
                <div className="flex gap-4 text-3xl justify-center items-center">
                  <FaWhatsapp />{" "}
                  <span className="text-sm">
                    <a
                      className="text-gray-600"
                      href={`https://wa.me/${shop?.phoneNumber}`}
                    >
                      الواتساب
                    </a>
                  </span>
                </div>
                {/* <div className="flex gap-4 text-3xl justify-center mt-4 items-center">
                  <BsCashCoin />
                  <span className="text-sm">
                    <p className="text-gray-600">السعر</p>
                    <p className="text-xl">{`${shop?.name} ريال`}</p>
                  </span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;
