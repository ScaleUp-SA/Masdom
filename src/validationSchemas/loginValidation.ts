import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string({
      invalid_type_error: "يجب ادخال احرف",
      required_error: "يجب ادخال البريد الالكتروني",
    })
    .email("ادخل بريد الكتروني صالح")
    .max(255, "لقد تخطيت العدد المسموح"),
  password: z
    .string({
      invalid_type_error: "يجب ادخال احرف و ارقام و رموز",
      required_error: "يجب ادخال كلمة السر",
    })
    .min(8, "يجب على الاقل ادخال 8 احرف و ارقام")
    .max(18, "لقد تخطيت العدد المسموح"),
});
