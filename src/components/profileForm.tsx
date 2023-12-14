"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { Toaster } from "@/components/ui/toaster";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Session } from "@/types";
import { updateUser } from "@/lib/dbQueries";
import axios from "axios";
import { useToast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

const phoneRegex = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
);

const formSchema = z.object({
  username: z.string().min(2, {
    message: "اسم المستخدم يجب ان يكون حرفين حد ادني",
  }),
  email: z.string().email({
    message: "ادخل بريد الكتروني صالح",
  }),
  phoneNumber: z.string().regex(phoneRegex, "رقم الهاتف غير صحيح"),
});

const ProfileForm = ({ session }: { session: Session | null }) => {
  const { status, update } = useSession();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: session?.user.username,
      email: session?.user.email,
      phoneNumber: session?.user.phoneNumber,
    },
  });
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    const userData = { ...values, id: session?.user.id };
    console.log(userData);
    try {
      const res = await axios.patch("api/users/update", userData);

      if (res?.status === 200) {
        toast({
          title: `تم تحديث بيناتك`,
        });
        update({
          username: userData.username,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
        });
        router.refresh();
      } else {
        toast({
          variant: "destructive",
          title: "حدث خطأ ما",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>البريد الالكتروني</FormLabel>
              <FormControl>
                <Input {...field} />
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
              <FormLabel>رقم الجوال</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">حفظ التغيرات</Button>
      </form>
    </Form>
  );
};

export default ProfileForm;
