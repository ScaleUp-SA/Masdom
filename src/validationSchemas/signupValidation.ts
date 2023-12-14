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
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
  username: z.string().min(3).max(255),
  phoneNumber: z.string().regex(phoneRegex, "رقم الهاتف غير صحيح"),
});
