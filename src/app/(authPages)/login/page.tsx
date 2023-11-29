"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
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
import { useRouter } from "next/navigation";
import axios from "axios";
import { Toaster } from "@/components/ui/toaster";
import { signIn } from "next-auth/react";
import Image from "next/image";
import bgImage from "../../../../public/images/heroBg.png";
import logo from "../../../../public/masdoomLogo.svg";

type Props = {};

const Page = (props: Props) => {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
  });

  async function onSubmit(values: z.infer<typeof loginFormSchema>) {
    const signInData = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (signInData?.error) {
      console.log(signInData?.error);
      toast({
        variant: "destructive",
        title: `${signInData?.error}`,
      });
    } else {
      toast({
        variant: "default",
        title: "logged in successfully",
      });
      router.push("/");
      router.refresh();
    }

    // try {
    //   const res = await axios.post("/api/users/login", values);
    //   router.push("/");
    //   router.refresh();
    // } catch (error: any) {
    //   console.log(error);
    //   toast({
    //     variant: "destructive",
    //     title: error.message,
    //   });
    //   console.log(error);
    // }
  }

  return (
    <div className="flex w-full">
      <Form {...form}>
        <div className=" flex flex-col justify-center items-center min-h-screen w-3/6 max-lg:w-full">
          <span className="mb-4 text-center space-y-4">
            <h1 className="text-4xl ">سجل الدخول الان</h1>
          </span>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-full p-14 text-center"
          >
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
              تسجيل الدخول
            </Button>
          </form>
          <Toaster />
        </div>
      </Form>

      {/* <div className=" w-3/6 max-lg:hidden">
        <Image src={bgImage} className="bg-cover bg-center w-full h-full" />
      </div> */}
      <div className="w-3/6 bg-green-400 flex flex-col items-center justify-center gap-2 text-white max-lg:hidden">
        {/* <Image src={bgImage} className="bg-cover bg-center w-full h-full" /> */}
        <Image src={logo} width={300} className="mb-12" alt={"login logo"} />
        <h4 className="text-3xl">مرحبا بعودتك</h4>
      </div>
    </div>
  );
};

export default Page;
