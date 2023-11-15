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

    console.log(signInData);

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
    <Form {...form}>
      <div className=" flex justify-center items-center min-h-screen w-full ">
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-1/4 "
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="example@email.com"
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
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Password" {...field} />
                </FormControl>
                {/* <FormDescription>
                This is your public display name.
              </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className=" bg-black text-slate-100 hover:text-black rounded"
            type="submit"
          >
            Submit
          </Button>
        </form>
        <Toaster />
      </div>
    </Form>
  );
};

export default Page;
