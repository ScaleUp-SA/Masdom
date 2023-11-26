"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { loginFormSchema } from "@/validationSchemas/loginValidation";
import { signupSchema } from "@/validationSchemas/signupValidation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import bgImage from "../../../../public/images/heroBg.png";
import logo from "../../../../public/masdoomLogo.svg";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      const res = await axios.post("/api/users/signup", values);
      console.log(res.data);
      toast({
        title: res.data.message,
      });
      router.push("/login");
      router.refresh();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: error.message,
        description: error.response.data.message,
      });
      console.log(error);
    }
  }

  return (
    <div className="flex">
      <div className="w-3/6 bg-green-400 flex flex-col items-center justify-center gap-2 text-white max-lg:hidden">
        {/* <Image src={bgImage} className="bg-cover bg-center w-full h-full" /> */}
        <Image src={logo} width={300} className="mb-12" alt={"signup logo"} />
        <h4 className="text-3xl">مرحبا بك في منصة مصدوم</h4>
        <p>الحراج الأول للسيارات المصدومة</p>
      </div>

      <Form {...form}>
        <div className=" flex flex-col justify-center items-center min-h-screen w-3/6 max-lg:w-full">
          <span className="mb-4 text-center space-y-4">
            <h1 className="text-4xl ">انشاء حساب</h1>
            {/* <p className="text-sm">الحراج الأول للسيارات المصدومة</p> */}
          </span>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full p-14 text-center"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>User name</FormLabel> */}
                  <FormControl className="rounded-full px-4">
                    <Input type="text" placeholder="الاسم" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Email</FormLabel> */}
                  <FormControl className="rounded-full px-4">
                    <Input
                      type="email"
                      placeholder="البريد الالكنتروني"
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Phone</FormLabel> */}
                  <FormControl className="rounded-full px-4">
                    <Input type="tel" placeholder="رقم الجوال" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Password</FormLabel> */}
                  <FormControl className="rounded-full px-4">
                    <Input type="password" placeholder="كلمة السر" {...field} />
                  </FormControl>
                  {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              className="w-full bg-green-400 text-white rounded-full hover:bg-green-600"
              type="submit"
            >
              انشاء حساب
            </Button>
          </form>
        </div>
      </Form>
    </div>
  );
};

export default Page;
