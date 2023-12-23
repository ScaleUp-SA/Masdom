"use client";

import ImageUplouder from "@/components/imageUplouder";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { FaCarSide } from "react-icons/fa6";
import { FaCarBurst } from "react-icons/fa6";


type Props = {};

const page = (props: Props) => {

  const [formData, setFormData] = useState({
    title: "",
    kilometers: "",
    model: "",
    transmission: "Automatic",
    offerDetails: "",
    location: "",
    price: "",
    carBrand: "",
    carModel: "",
    category: "",
    engineCapacity: "",
    carColor: "",
    collisionLocation: "",
  });

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [fieldName]: value,
    }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form Data:", formData);
  };



  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-center p-4 mt-6">
        <h1 className="text-[#04214c] font-bold text-3xl">إضــافة سيـارة للبيـــع</h1>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="px-8 pb-8 min-h-screen flex flex-col gap-6 items-center">
          <div> <ImageUplouder /></div>
          <div className="w-4/5">
            <label className="flex flex-col gap-2 w-full">
              عنوان العرض
              <input required type="text" placeholder="رينو Logan 2021 - الفئة الثانية" className="p-2 rounded border" value={formData.title} onChange={(e) => handleInputChange("title", e.target.value)} ></input>
            </label>
          </div>
          <div className="w-4/5 grid grid-cols-3 gap-6 max-md:grid-cols-1">
            <span>
              <label className="flex flex-col gap-2 w-full">
                عدد الكيلومترات
                <input required type="number" placeholder="140" className="p-2 rounded border" value={formData.kilometers} onChange={(e) => handleInputChange("kilometers", e.target.value)}></input>
              </label>
            </span>
            <span>
              <label className="flex flex-col gap-2 w-full">
                الموديل
                <input required type="number" placeholder="2022" className="p-2 rounded border" value={formData.model} onChange={(e) => handleInputChange("model", e.target.value)}></input>
              </label>
            </span>
            <span>
              <label className="flex flex-col gap-2 w-full">
                ناقل الحركة
                <select
                  required
                  className="p-2 rounded border"
                  value={formData.transmission}
                  onChange={(e) => handleInputChange("transmission", e.target.value)}
                >
                  <option value="Automatic">Automatic</option>
                  <option value="Manuel">Manuel</option>
                </select>
              </label>
            </span>
          </div>
          <div className="flex flex-col w-4/5 gap-2">
            <label>
              تفاصيل العرض
            </label>
            <textarea
              placeholder="اكتب تفاصيل عرضك"
              className="max-h-24 rounded p-2 border"
              value={formData.offerDetails}
              onChange={(e) => handleInputChange("offerDetails", e.target.value)}>
            </textarea>
          </div>
          <div className="grid grid-cols-2 w-4/5 gap-6 max-md:grid-cols-1">
            <span>
              <label className="flex flex-col gap-2 w-full">
                الموقع
                <input required type="text" placeholder="الرياض / حي الربيع" className="p-2 rounded border" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)}></input>
              </label>
            </span>
            <span>
              <label className="flex flex-col gap-2 w-full">
                السعر
                <input type="number" placeholder="24,750" className="p-2 rounded border" value={formData.price} onChange={(e) => handleInputChange("price", e.target.value)}></input>
              </label>
            </span>
          </div>
          <div className="flex flex-col items-start gap-4 mt-6 w-4/5">
            <span className="flex items-center gap-4 text-xl">
              <span className="text-green-400 text-4xl">
                <FaCarSide />
              </span>
              <h4 className="text-[#04214c] font-bold">تفاصيل السيارة</h4>
            </span>
            <div className="grid grid-cols-2 w-full gap-6 max-md:grid-cols-1">
              <span>
                <label className="flex flex-col gap-2 w-full">
                  ماركة العربية
                  <input required type="text" placeholder="مرسيدس" className="p-2 rounded border" value={formData.carBrand} onChange={(e) => handleInputChange("carBrand", e.target.value)}></input>
                </label>
              </span>
              <span>
                <label className="flex flex-col gap-2 w-full">
                  الموديل
                  <input type="text" placeholder="بيكانتو" className="p-2 rounded border" value={formData.carModel} onChange={(e) => handleInputChange("carModel", e.target.value)}></input>
                </label>
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 w-4/5 gap-6 max-md:grid-cols-1">
            <span>
              <label className="flex flex-col gap-2 w-full">
                الفئة
                <input type="text" placeholder="الأولى" className="p-2 rounded border" value={formData.category} onChange={(e) => handleInputChange("category", e.target.value)}></input>
              </label>
            </span>
            <span>
              <label className="flex flex-col gap-2 w-full">
                سعة الموتور
                <input required type="number" placeholder="1500" className="p-2 rounded border" value={formData.engineCapacity} onChange={(e) => handleInputChange("engineCapacity", e.target.value)}></input>
              </label>
            </span>
          </div>
          <div className="w-4/5">
            <label className="flex flex-col gap-2 w-full">
              لون العربية
              <input required placeholder="الاسود" className="p-2 rounded border" value={formData.carColor} onChange={(e) => handleInputChange("carColor", e.target.value)}></input>
            </label>
          </div>
          <div className="flex flex-col items-start gap-4 mt-6 w-4/5">

            <span className="flex items-center gap-4 text-xl">
              <span className="text-green-400 text-4xl">
                <FaCarBurst />
              </span>
              <h4 className="text-[#04214c] font-bold"> أماكن الصدمات</h4>
            </span>
            <div className="flex flex-col w-full gap-2">
              <label>
                مكان الصدمة
              </label>
              <textarea required placeholder="مكان الصدمة" className="max-h-24 rounded p-2 border" value={formData.collisionLocation} onChange={(e) => handleInputChange("collisionLocation", e.target.value)}></textarea>
            </div>
          </div>

          <div className="w-4/5 my-4">
            <Button type="submit" className="w-full">نشر المعاملة</Button>
          </div>

        </div>
      </form>

    </div>
  );
};

export default page;
