import { ZodSchema, z } from "zod";
const phoneRegex = new RegExp(
  /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/
);

export const signupSchema: ZodSchema<{
  email: string;
  password: string;
  username: string;
  phoneNumber: string;
}> = z.object({
  email: z
    .string({
      invalid_type_error: "يجب ادخال احرف",
      required_error: "يجب ادخال البريد الالكتروني",
    })
    .email("ادخل بريد الكتروني صالح")
    .max(225, "لقد تخطيت العدد المسموح"),
  password: z
    .string({
      invalid_type_error: "يجب ادخال احرف و ارقام و رموز",
      required_error: "يجب ادخال كلمة السر",
    })
    .min(8, "يجب علي الاقل ادخال 8 احرف و ارقام")
    .max(18, "لقد تخطيت العدد المسموح"),
  username: z
    .string({
      invalid_type_error: "يجب ادخال احرف",
      required_error: "يجب ادخال الاسم",
    })
    .min(2, "يجب علي الاقل ادخال 2 احرف و ارقام")
    .max(10, "لقد تخطيت العدد المسموح"),
  phoneNumber: z
    .string({ required_error: "يجب ادخال رقم الجوال" })
    .regex(phoneRegex, "رقم الهاتف غير صحيح"),
});
