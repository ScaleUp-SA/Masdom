"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { FormData, FullCar, ShopFormData } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CarsMakers, CarsModels, Damage } from "@prisma/client";
import ImageUplouder from "@/components/imageUplouder";
import { Files } from "@/components/listingCarsForm";
import { useToast } from "@/components/ui/use-toast";

const Page = ({ params }: { params: { shopId: string } }) => {
  const [files, setFiles] = useState<Files>();
  const [fileError, setFileError] = useState(false);
  const [carData, setCarData] = useState<FullCar>();

  const [formData, setFormData] = useState<ShopFormData>({
    images: [],
    shopId: "",
    name: "",
    city: "",
    country: "",
    cars: [""],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const shopId = params.shopId;
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.put("/api/shops/update", formData);
        toast({
          title: `تم تعديل البيانات `,
        });
      } catch (error) {
        toast({
          variant: "destructive",
          title: `حدث خطأ ما اثناء تعديل البيانات`,
        });
        console.error(error);
      }
    }
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleAddMore = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      cars: [...prevFormData.cars, ""],
    }));
  };

  const handleDescriptionChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedCars = [...formData.cars]; // Create a copy of the array
    updatedCars[index] = event.target.value;

    setFormData((prevFormData) => ({
      ...prevFormData,
      cars: updatedCars, // Update the formData with the modified array
    }));
  };

  const filesHandler = (files: Files) => {
    const { public_id, video_id } = files;
    setFiles(files);
    const updatedImages = public_id.map((link: string) => ({ links: link }));
    const updatedVideos = video_id.map((link: string) => ({ links: link }));

    const updatedFormData = {
      ...formData,
      images: [...formData.images, ...updatedImages],
    };

    setFormData(updatedFormData as any);
    return files;
  };
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name) {
      errors.name = "الاسم مطلوب";
    }

    if (!formData.city) {
      errors.city = "المدينة مطلوبة";
    }

    if (!formData.country) {
      errors.country = "البلد مطلوبة";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    (async () => {
      try {
        const carDataResponse = await axios.get(`/api/shops/getshop/${shopId}`);
        if (carDataResponse.status === 200) {
          const carInfo = carDataResponse.data.shop;
          setCarData(carInfo);

          setFormData((prevFormData) => ({
            ...prevFormData,
            ...carInfo,
            shopId: shopId,
          }));
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [shopId]);

  return (
    <div className="w-full py-10 px-24 max-lg:p-1">
      <div className="mt-10">
        <ImageUplouder
          filesHandler={filesHandler}
          images={carData?.images}
          videos={carData?.videos}
        />
        {fileError && (
          <p className=" text-red-600">يجب ادخال 3 صور علي الاقل</p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="px-14 py-8">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            عنوان العرض{" "}
          </label>
          <Input
            placeholder="Enter Title"
            onChange={handleChange}
            value={formData.name}
            type="text"
            id="name"
            name="name"
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
              errors.title ? "border-red-500" : ""
            }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>

        <div className=" flex flex-wrap gap-6 max-2xl:gap-4 items-center justify-start">
          <div className="mb-4 w-[49%] max-lg:w-full">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              المدينة
            </label>
            <Input
              placeholder="Enter City"
              onChange={handleChange}
              value={formData.city}
              type="text"
              id="city"
              name="city"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                errors.city ? "border-red-500" : ""
              }`}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div className="mb-4 w-[49%] max-lg:w-full">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              البلد{" "}
            </label>
            <Input
              placeholder="Enter Country"
              onChange={handleChange}
              value={formData.country}
              type="text"
              id="country"
              name="country"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${
                errors.country ? "border-red-500" : ""
              }`}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>

          <div className="flex flex-col w-4/5 gap-2">
            {formData.cars.map((item, index) => {
              return (
                <div
                  key={`car-${index}`}
                  className="grid w-full max-w-sm items-center gap-1.5"
                >
                  <label htmlFor={`cars-${index}`}>ادخل سيارات التخصص</label>
                  <Input
                    onChange={(e) => handleDescriptionChange(index, e)}
                    type="text"
                    id={`cars-${index}`}
                    value={item}
                  />
                </div>
              );
            })}
          </div>
          <Button
            type="button"
            onClick={handleAddMore}
            className="w-[29%] max-lg:w-[50%] bg-green-400 hover:bg-green-600"
          >
            اضف الضرر
          </Button>
        </div>
        <Button
          type="submit"
          className="px-4 py-2 text-white rounded-md mt-8 w-full bg-green-400 hover:bg-green-600"
        >
          حفظ التغييرات
        </Button>
      </form>
    </div>
  );
};

export default Page;
