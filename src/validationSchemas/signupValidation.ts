import { ZodSchema, z } from "zod";

export const signupSchema: ZodSchema<{
  email: string;
  password: string;
  username: string;
  phoneNumber: string;
}> = z.object({
  email: z.string().email().min(1).max(255),
  password: z.string().min(6).max(255),
  username: z.string().min(3).max(255),
  phoneNumber: z.string().min(10).max(15),
});
