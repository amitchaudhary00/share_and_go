import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().trim().min(2).max(150),
  email: z.email().toLowerCase(),
  mobile: z.string().regex(/^[0-9]{10}$/, {
    message: "Mobile must be 10 digits",
  }),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
});

export const loginSchema = z.object({
  email: z.email().toLowerCase(),
  password: z.string().min(1),
});

export const verifyEmailSchema = z.object({
  email: z.email().toLowerCase(), userId: z.string().trim(), otp: z.string().trim()
})