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
import axios from "axios";
import { Label } from "@radix-ui/react-label";

type Props = {};

const phoneRegex = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
);

const formSchema = z.object({
  name: z.string().min(5, "يجب علي الاقل ان يحتوي علي 5 احرف علي الاقل"),
  country: z.string().min(3, "يجب علي الاقل ان يحتوي علي 3 احرف علي الاقل"),
  city: z.string().min(3, "يجب علي الاقل ان يحتوي علي 3 احرف علي الاقل"),
  phoneNumber: z.string().regex(phoneRegex, "رقم الهاتف غير صحيح"),
});

export interface Files {
  public_id: string[];
  thumbnail_url: string[];
  video_id: string[];
}

const AddingCarsForm = (props: Props) => {
  const [files, setFiles] = useState<Files>();
  const [fileError, setFileError] = useState(false);
  const [addCars, setAddCars] = useState([""]);
  const router = useRouter();

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      country: "",
      city: "",
      phoneNumber: "",
    },
  });

  const filesHandler = (files: Files) => {
    setFiles(files);
    return files;
  };

  const handleAddMore = () => {
    setAddCars([...addCars, ""]);
  };

  const handleCarsNames = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    console.log(e.target.value);
    const updatedCars = [...addCars];
    updatedCars[index] = e.target.value;
    setAddCars(updatedCars);
  };

  console.log(addCars);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (files?.public_id.length! < 3) {
      setFileError(true);
      return;
    } else {
      setFileError(false);
      const updatedshops = {
        ...values,
        ShopsImages: files?.public_id.map((link) => {
          return { links: link };
        }),
        cars: addCars,
      };

      try {
        const response = await axios.post("/api/shops/create", updatedshops);
        toast({
          variant: "default",
          title: "تم نشر المحل",
        });
        router.push(`/`);
      } catch (error) {
        console.error(error);
      }
    }
    console.log(values, "dadasdasdas");
  }

  return (
    <div className="flex flex-col">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-8 pb-8 min-h-screen flex flex-col gap-6 items-center"
        >
          <div className="mt-10">
            <ImageUplouder filesHandler={filesHandler} />
            {fileError && (
              <p className=" text-red-600">يجب ادخال 3 صور علي الاقل</p>
            )}
          </div>
          <div className="w-4/5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المحل</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="طمني جروب لصيانة السيارات"
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
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البلد</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="السعودية" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المدينة</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="حي الربيع" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الهاتف</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
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
                اضف سيارات التخصص
              </Button>
            </div>
            {addCars.map((cars, index) => (
              <div
                key={index}
                className="grid w-full max-w-sm items-center gap-1.5"
              >
                <Label htmlFor="damage">اسم السيارة</Label>
                <Input
                  type="text"
                  id="damage"
                  placeholder="مرسيديس"
                  onChange={(e) => handleCarsNames(index, e)}
                  value={addCars[index]}
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

export default AddingCarsForm;
