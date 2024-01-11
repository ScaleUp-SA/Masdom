"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";
import ImageUplouder from "./imageUplouder";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import axios from "axios";
import { useSession } from "next-auth/react";
import { CarsMakers, CarsModels, Damage, ListingCars } from "@prisma/client";
import { usePathname } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { FullCar } from "@/types";
import { Label } from "./ui/label";

const negativeNumbersValidation = (number: number) => {
  if (number < 0) return false;

  return true;
};

const priceValidation = (price: number) => {
  if (+price < 0) return false;

  return true;
};

const cities = [
  "الرياض",
  "مكة المكرمة",
  "المدينة المنورة",
  "الشرقية",
  "الجوف",
  "الباحة",
  "عسير",
  "القصيم",
  "حائل",
  "تبوك",
  "الحدود الشمالية",
  "جازان",
  "نجران",
];

const carShapes = [
  "سيدان (Sedan)",
  "كوبيه (Coupe)",
  "هاتشباك (Hatchback)",
  "كروس أوفر (Crossover)",
  "سيارة دفع رباعي (SUV - Sport Utility Vehicle)",
  "شاحنة (Pickup Truck)",
  "فان (Van)",
  "كابريوليه (Convertible)",
  "رياضية (Sports Car)",
  "سيارة كهربائية (Electric Car)",
];

const formSchema = z.object({
  title: z.string().min(5, "يجب علي الاقل ان يحتوي علي 5 احرف علي الاقل"),
  mileage: z.coerce
    .number({
      invalid_type_error: "يجب ادخال ارقتم",
    })
    .min(0, "لا يمكن أن يكون حقل المشي فارغًا")
    .refine(
      (value) => {
        return negativeNumbersValidation(value);
      },
      {
        message: "السعر يجب أن يكون رقمًا موجبًا",
      }
    ),
  year: z.string().min(4, "سنة الصنع غير صالحة").max(4, "سنة الصنع غير صالحة"),
  transmission: z.enum(["اوتوماتيك", "مانيوال"]),
  offerDetails: z
    .string()
    .min(10, "يجب علي الاقل ان يحتوي علي 10 احرف علي الاقل"),
  country: z.string().optional(),
  city: z.enum([
    "الرياض",
    "مكة المكرمة",
    "المدينة المنورة",
    "الشرقية",
    "الجوف",
    "الباحة",
    "عسير",
    "القصيم",
    "حائل",
    "تبوك",
    "الحدود الشمالية",
    "جازان",
    "نجران",
  ]),
  price: z.coerce
    .number({
      invalid_type_error: "يجب ادخال ارقم فقط",
    })
    .min(0, "السعر يجب أن يكون رقمًا موجبًا")
    .refine(
      (value) => {
        return priceValidation(value);
      },
      {
        message: "السعر يجب أن يكون رقمًا موجبًا",
      }
    ),
  carsMakersId: z.string(),
  carsModelsId: z.string(),
  carClass: z.string().min(2, "يجب علي الاقل ان يحتوي علي 2 احرف علي الاقل"),
  cylinders: z.coerce
    .number({
      invalid_type_error: "يجب ادخال ارقتم",
    })
    .min(0, "سعة المحرك يجب أن تكون رقمًا موجبًا"),
  color: z.string().min(2, "يجب علي الاقل ان يحتوي علي 2 احرف علي الاقل"),
  shape: z.enum([
    "سيدان (Sedan)",
    "كوبيه (Coupe)",
    "هاتشباك (Hatchback)",
    "كروس أوفر (Crossover)",
    "سيارة دفع رباعي (SUV - Sport Utility Vehicle)",
    "شاحنة (Pickup Truck)",
    "فان (Van)",
    "كابريوليه (Convertible)",
    "رياضية (Sports Car)",
    "سيارة كهربائية (Electric Car)",
  ]),
});

type Props = {
  params?: { carId: string };
};

export interface Files {
  public_id: string[];
  thumbnail_url: string[];
  video_id: string[];
}

const ListingCarsForm = ({ params }: Props) => {
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const carId = params?.carId;
  const [files, setFiles] = useState<Files>();
  const [fileError, setFileError] = useState(false);
  const [makers, setMakers] = useState<CarsMakers[]>([]);
  const [model, setModel] = useState<CarsModels[]>([]);
  const [carData, setCarData] = useState<FullCar>();
  const [damages, setDamages] = useState([{ description: "" }]);
  const isEditMode = pathname.includes("edit");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      mileage: 0,
      year: "",
      transmission: "اوتوماتيك",
      offerDetails: "",
      country: "السعودية",
      city: "الرياض",
      price: 0,
      carsMakersId: "",
      carsModelsId: "",
      carClass: "",
      cylinders: 0,
      color: "",
    },
  });

  const handleAddMore = () => {
    setDamages([...damages, { description: "" }]);
  };

  const handleDescriptionChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedDamages = [...damages];
    updatedDamages[index].description = event.target.value;
    setDamages(updatedDamages);
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/maker");
        console.log(res);
        setMakers(res.data.makers);
      } catch (error) {
        console.error(error);
      }
    })();
  }, []);

  const filesHandler = (files: Files) => {
    console.log(files, "fffffff");
    setFiles(files);
    return files;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (files?.public_id.length! < 3) {
      setFileError(true);
      return;
    } else {
      setFileError(false);

      const updatedCar = {
        ...values,
        country: "السعودية",
        ownerId: session?.user.id,
        CarsImages: files?.public_id.map((link) => {
          return { links: link };
        }),
        CarsVideos: files?.video_id.map((link) => {
          return { links: link };
        }),
        damage: damages,
      };
      console.log(updatedCar, "updated");

      try {
        const response = await axios.post(
          "/api/listingcars/create",
          updatedCar
        );
        console.log(response.data);
        toast({
          variant: "default",
          title: "تم نشر السيارة",
        });
        router.push(`/`);
      } catch (error) {
        console.error(error);
      }
    }
  }

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-8 pb-8 min-h-screen flex flex-col gap-6 items-center"
        >
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
          <div className="w-4/5">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان العرض</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="text"
                      placeholder="رينو Logan 2021 - الفئة الثانية"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-4/5 grid grid-cols-3 gap-6 max-md:grid-cols-1">
            <FormField
              control={form.control}
              name="mileage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عدد المشي</FormLabel>
                  <FormControl>
                    <Input required type="text" placeholder="140" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="year"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الموديل</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="number" // This is important, make sure it's type="number"
                      placeholder="2022"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="transmission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>القير</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className=" flex flex-row-reverse">
                        <SelectValue placeholder="اختار القير" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem
                          className=" flex flex-row-reverse"
                          value="اوتوماتيك"
                        >
                          اوتوماتيك
                        </SelectItem>
                        <SelectItem
                          className=" flex flex-row-reverse"
                          value="مانيوال"
                        >
                          مانيوال
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col w-4/5 gap-2">
            <FormField
              control={form.control}
              name="offerDetails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تفاصيل العرض</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="اكتب تفاصيل عرضك"
                      className="max-h-24 rounded p-2 border"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 w-4/5 gap-6 max-md:grid-cols-1">
            <FormField
              disabled
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البلد</FormLabel>
                  <FormControl>
                    <Input
                      disabled
                      type="text"
                      placeholder="السعودية"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المدينة</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="text"
                      placeholder="الرياض / حي الربيع"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المدينة</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className=" flex flex-row-reverse">
                        <SelectValue placeholder="اختار المدينة" />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem
                            className=" flex flex-row-reverse"
                            key={city}
                            value={city}
                          >
                            {city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* <FormField
              control={form.control}
              name="shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الشكل</FormLabel>
                  <FormControl>
                    <Input
                      required
                      type="text"
                      placeholder="سيدان"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="shape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الشكل</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className=" flex flex-row-reverse">
                        <SelectValue placeholder="اختار الشكل" />
                      </SelectTrigger>
                      <SelectContent>
                        {carShapes.map((car) => (
                          <SelectItem
                            className=" flex flex-row-reverse"
                            key={car}
                            value={car}
                          >
                            {car}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>السعر</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="24,750" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 w-4/5 gap-6 max-md:grid-cols-1">
            <FormField
              control={form.control}
              name="carsMakersId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>مصنع السيارة</FormLabel>
                  <FormControl>
                    {!isEditMode ? (
                      <Select
                        onValueChange={async (value) => {
                          console.log(value);
                          field.onChange(value);
                          const res = await axios.get(`/api/model/${value}`);
                          const models = res.data.models;
                          setModel(models);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className=" flex flex-row-reverse">
                          <SelectValue placeholder="اختار المصنع" />
                        </SelectTrigger>
                        <SelectContent>
                          {makers.map((maker) => (
                            <SelectItem
                              className=" flex flex-row-reverse"
                              key={maker.id}
                              value={maker.id}
                            >
                              {maker.name}{" "}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select
                        onValueChange={async (value) => {
                          field.onChange(value);
                          const res = await axios.get(`/api/model/${value}`);
                          const models = res.data.models;
                          setModel(models);
                        }}
                        defaultValue={carData?.CarsMakers?.id}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={carData?.CarsMakers?.name}
                            defaultChecked={true}
                            defaultValue={carData?.CarsMakers?.name}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {makers.map((maker) => (
                            <SelectItem
                              defaultValue={carData?.CarsMakers?.id}
                              key={maker.id}
                              value={maker.id}
                            >
                              {maker.name}{" "}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="carsModelsId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ماركة السيارة</FormLabel>
                  <FormControl>
                    {!isEditMode ? (
                      <Select
                        onValueChange={async (value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className=" flex flex-row-reverse">
                          <SelectValue placeholder="اختار الماركة" />
                        </SelectTrigger>
                        <SelectContent>
                          {model.map((item) => (
                            <SelectItem
                              className=" flex flex-row-reverse"
                              key={item.id}
                              value={item.id}
                            >
                              {item.name}{" "}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Select
                        onValueChange={async (value) => {
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={carData?.CarsModels?.name}
                            defaultChecked={true}
                            defaultValue={carData?.CarsModels?.name}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {model.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.name}{" "}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 w-4/5 gap-6 max-md:grid-cols-1">
            <FormField
              control={form.control}
              name="carClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الفئة</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="الأولى" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cylinders"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>سعة الموتور</FormLabel>
                  <FormControl>
                    <Input required type="text" placeholder="1500" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="w-4/5">
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>لون السيارة</FormLabel>
                  <FormControl>
                    <Input required placeholder="الاسود" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col w-4/5 gap-2">
            <div className=" flex justify-center">
              <Button
                className="w-1/2 bg-green-400 hover:bg-green-600"
                type="button"
                onClick={handleAddMore}
              >
                اضف المزيد من الضرر
              </Button>
            </div>
            {damages.map((damage, index) => (
              <div
                key={index}
                className="grid w-full max-w-sm items-center gap-1.5"
              >
                <Label htmlFor="damage">الضرر</Label>
                <Input
                  onChange={(e) => handleDescriptionChange(index, e)}
                  type="text"
                  id="damage"
                  placeholder="ادخل الضرر و المكان"
                />
              </div>
            ))}
          </div>

          <div className="w-4/5 my-4">
            <Button className="w-full bg-green-400 hover:bg-green-600">
              نشر المعاملة
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ListingCarsForm;
