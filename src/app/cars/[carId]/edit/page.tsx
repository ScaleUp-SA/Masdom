"use client";
import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { FormData, FullCar } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CarsMakers, CarsModels, Damage } from "@prisma/client";
import ImageUplouder from "@/components/imageUplouder";
import { Files } from "@/components/listingCarsForm";

const Page = ({ params }: { params: { carId: string } }) => {
  const [files, setFiles] = useState<Files>();
  const [fileError, setFileError] = useState(false);
  const [carData, setCarData] = useState<FullCar>();
  const [makers, setMakers] = useState<CarsMakers[]>([]);
  const [model, setModel] = useState<CarsModels[]>([]);

  const [formData, setFormData] = useState<FormData>({
    videos: [],
    images: [],
    damage: [],
    carId: "",
    title: "",
    mileage: "",
    year: "",
    carsModelsId: "",
    city: "",
    color: "",
    country: "",
    cylinders: "",
    offerDetails: "",
    ownerId: "",
    price: "",
    shape: "",
    carClass: "",
    carsMakersId: "",
    transmission: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const carId = params.carId;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await axios.put("/api/listingcars/update", formData);
        console.log(response.data);

        // Handle success or redirect to another page
      } catch (error) {
        console.error(error);
        // Handle error
      }
    }
  };
  console.log(formData, "form");

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
      damage: [
        ...prevFormData.damage,
        { id: "", description: "", listingCarId: "" }, // Fill in default values as needed
      ] as Damage[],
    }));
  };

  const handleDescriptionChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prevFormData) => {
      const updatedDamages = [...prevFormData.damage]; // Create a copy of the array
      updatedDamages[index] = {
        // Update the specific index
        ...updatedDamages[index],
        description: event.target.value,
      };
      return {
        ...prevFormData,
        damage: updatedDamages, // Update the formData with the modified array
      };
    });
    console.log(formData);
  };

  const filesHandler = (files: Files) => {
    console.log(files, "fffffff");
    const { public_id, video_id } = files;
    setFiles(files);
    const updatedImages = public_id.map((link: string) => ({ links: link }));
    const updatedVideos = video_id.map((link: string) => ({ links: link }));

    const updatedFormData = {
      ...formData,
      images: [...formData.images, ...updatedImages],
      videos: [...formData.videos, ...updatedVideos],
    };

    setFormData(updatedFormData as any);
    return files;
  };
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title) {
      errors.title = "Title is required";
    }

    if (!formData.mileage) {
      errors.mileage = "Mileage is required";
    }

    if (!formData.year) {
      errors.year = "Year is required";
    }

    if (!formData.transmission) {
      errors.transmission = "Transmission is required";
    }

    if (!formData.carClass) {
      errors.carClass = "Car Class is required";
    }

    if (!formData.carsMakersId) {
      errors.carsMakersId = "Cars Makers ID is required";
    }

    if (!formData.carsModelsId) {
      errors.carsModelsId = "Cars Models ID is required";
    }

    if (!formData.city) {
      errors.city = "City is required";
    }

    if (!formData.color) {
      errors.color = "Color is required";
    }

    if (!formData.country) {
      errors.country = "Country is required";
    }

    if (!formData.cylinders) {
      errors.cylinders = "Cylinders is required";
    }

    if (!formData.offerDetails) {
      errors.offerDetails = "Offer Details is required";
    }

    if (!formData.ownerId) {
      errors.ownerId = "Owner ID is required";
    }

    if (!formData.price) {
      errors.price = "Price is required";
    }

    if (!formData.shape) {
      errors.shape = "Shape is required";
    }

    setErrors(errors);

    return Object.keys(errors).length === 0;
  };

  useEffect(() => {
    (async () => {
      try {
        const carDataResponse = await axios.get(
          `/api/listingcars/getcar/${carId}`
        );
        if (carDataResponse.status === 200) {
          const carInfo = carDataResponse.data.car;
          setCarData(carInfo);

          setFormData((prevFormData) => ({
            ...prevFormData,
            ...carInfo,
            carId: carId,
            damage: carInfo.damage,
          }));
          console.log(carDataResponse);

          const makersResponse = await axios.get("/api/maker");
          if (makersResponse.status === 200) {
            setMakers(makersResponse.data.makers);
          }
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, [carId]);

  useEffect(() => {
    if (formData.carsMakersId) {
      (async () => {
        try {
          const modelsData = await axios.get(
            `/api/model/${formData.carsMakersId}`
          );
          console.log(modelsData, "models");
          setModel(modelsData.data.models);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [formData.carsMakersId]);

  return (
    <div className=" w-full p-10 max-lg:p-1">
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
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <Input
            placeholder="Enter Title"
            onChange={handleChange}
            value={formData.title}
            type="text"
            id="title"
            name="title"
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.title ? "border-red-500" : ""
              }`}
          />
          {errors.title && (
            <p className="text-red-500 text-sm mt-1">{errors.title}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="offerDetails"
            className="block text-sm font-medium text-gray-700"
          >
            Offer Details
          </label>
          <Input
            placeholder="Enter Offer Details"
            onChange={handleChange}
            value={formData.offerDetails}
            type="text"
            id="offerDetails"
            name="offerDetails"
            className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.offerDetails ? "border-red-500" : ""
              }`}
          />
          {errors.offerDetails && (
            <p className="text-red-500 text-sm mt-1">{errors.offerDetails}</p>
          )}
        </div>
        <div className=" flex flex-wrap gap-6 items-center justify-start">
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="mileage"
              className="block text-sm font-medium text-gray-700"
            >
              Mileage
            </label>
            <Input
              placeholder="Enter Mileage"
              onChange={handleChange}
              value={formData.mileage}
              type="text"
              id="mileage"
              name="mileage"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.mileage ? "border-red-500" : ""
                }`}
            />
            {errors.mileage && (
              <p className="text-red-500 text-sm mt-1">{errors.mileage}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="year"
              className="block text-sm font-medium text-gray-700"
            >
              Year
            </label>
            <Input
              placeholder="Enter Year"
              onChange={handleChange}
              value={formData.year}
              type="text"
              id="year"
              name="year"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.year ? "border-red-500" : ""
                }`}
            />
            {errors.year && (
              <p className="text-red-500 text-sm mt-1">{errors.year}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="transmission"
              className="block text-sm font-medium text-gray-700"
            >
              Transmission
            </label>
            <select
              onChange={handleChange}
              value={formData.transmission}
              id="transmission"
              name="transmission"
              className={`mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-500 rounded-md ${errors.year ? "border-red-500" : ""
                }`}
            >
              <option value="اوتوماتيك">اوتوماتيك</option>
              <option value="مانيوال">مانيوال</option>
            </select>
            {errors.transmission && (
              <p className="text-red-500 text-sm mt-1">{errors.transmission}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="carClass"
              className="block text-sm font-medium text-gray-700"
            >
              Car Class
            </label>
            <Input
              placeholder="Enter Car Class"
              onChange={handleChange}
              value={formData.carClass}
              type="text"
              id="carClass"
              name="carClass"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.carClass ? "border-red-500" : ""
                }`}
            />
            {errors.carClass && (
              <p className="text-red-500 text-sm mt-1">{errors.carClass}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="carsMakersId"
              className="block text-sm font-medium text-gray-700"
            >
              Cars Makers ID
            </label>

            <select
              onChange={handleChange}
              value={formData.carsMakersId}
              id="carsMakersId"
              name="carsMakersId"
              className={`mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-500 rounded-md ${errors.year ? "border-red-500" : ""
                }`}
            >
              {makers.map((maker, idx) => (
                <option key={idx} value={maker.id}>
                  {maker.name}
                </option>
              ))}
            </select>

            {errors.carsMakersId && (
              <p className="text-red-500 text-sm mt-1">{errors.carsMakersId}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="carsModelsId"
              className="block text-sm font-medium text-gray-700"
            >
              Cars Models ID
            </label>
            <select
              onChange={handleChange}
              value={formData.carsModelsId}
              id="carsModelsId"
              name="carsModelsId"
              className={`mt-1 h-10 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-500 rounded-md ${errors.year ? "border-red-500" : ""
                }`}
            >
              {Array.isArray(model) &&
                model.map((item, idx) => (
                  <option key={idx} value={item.id}>
                    {item.name}
                  </option>
                ))}
            </select>
            {errors.carsModelsId && (
              <p className="text-red-500 text-sm mt-1">{errors.carsModelsId}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              City
            </label>
            <Input
              placeholder="Enter City"
              onChange={handleChange}
              value={formData.city}
              type="text"
              id="city"
              name="city"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.city ? "border-red-500" : ""
                }`}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="color"
              className="block text-sm font-medium text-gray-700"
            >
              Color
            </label>
            <Input
              placeholder="Enter Color"
              onChange={handleChange}
              value={formData.color}
              type="text"
              id="color"
              name="color"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.color ? "border-red-500" : ""
                }`}
            />
            {errors.color && (
              <p className="text-red-500 text-sm mt-1">{errors.color}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Country
            </label>
            <Input
              placeholder="Enter Country"
              onChange={handleChange}
              value={formData.country}
              type="text"
              id="country"
              name="country"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.country ? "border-red-500" : ""
                }`}
            />
            {errors.country && (
              <p className="text-red-500 text-sm mt-1">{errors.country}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="cylinders"
              className="block text-sm font-medium text-gray-700"
            >
              Cylinders
            </label>
            <Input
              placeholder="Enter Cylinders"
              onChange={handleChange}
              value={formData.cylinders}
              type="text"
              id="cylinders"
              name="cylinders"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.cylinders ? "border-red-500" : ""
                }`}
            />
            {errors.cylinders && (
              <p className="text-red-500 text-sm mt-1">{errors.cylinders}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="ownerId"
              className="block text-sm font-medium text-gray-700"
            >
              Owner ID
            </label>
            <Input
              placeholder="Enter Owner ID"
              onChange={handleChange}
              value={formData.ownerId}
              type="text"
              id="ownerId"
              name="ownerId"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.ownerId ? "border-red-500" : ""
                }`}
            />
            {errors.ownerId && (
              <p className="text-red-500 text-sm mt-1">{errors.ownerId}</p>
            )}
          </div>
          <div className="mb-4 w-[45%] max-lg:w-full">
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700"
            >
              Price
            </label>
            <Input
              placeholder="Enter Price"
              onChange={handleChange}
              value={formData.price}
              type="text"
              id="price"
              name="price"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.price ? "border-red-500" : ""
                }`}
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
          <div className="mb-4 w-full">
            <label
              htmlFor="shape"
              className="block text-sm font-medium text-gray-700"
            >
              Shape
            </label>
            <Input
              placeholder="Enter Shape"
              onChange={handleChange}
              value={formData.shape}
              type="text"
              id="shape"
              name="shape"
              className={`mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md ${errors.shape ? "border-red-500" : ""
                }`}
            />
            {errors.shape && (
              <p className="text-red-500 text-sm mt-1">{errors.shape}</p>
            )}
          </div>
          <div className="flex flex-col w-4/5 gap-2">
            {formData.damage.map((item, index) => (
              <div
                key={index}
                className="grid w-full max-w-sm items-center gap-1.5"
              >
                <label htmlFor="damage">الضرر</label>
                <Input
                  onChange={(e) => handleDescriptionChange(index, e)}
                  type="text"
                  id="damage"
                  placeholder="ادخل الضرر و المكان"
                  value={item.description}
                />
              </div>
            ))}
          </div>
          <Button type="button" onClick={handleAddMore} className="w-[29%] max-lg:w-[50%]">
            اضف الضرر
          </Button>
        </div>
        <Button type="submit" className="px-4 py-2 text-white rounded-md mt-8 w-full">
          Submit
        </Button>
      </form>
    </div>
  );
};

export default Page;
