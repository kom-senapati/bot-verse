import { z } from "zod";

export const signupSchema = z.object({
  name: z.string().min(3, {
    message: "Name should be at least 3 characters long.",
  }),
  username: z.string().min(3, {
    message: "Username should be at least 3 characters long.",
  }),
  email: z.string().email({
    message: "Enter a valid email.",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(32, { message: "Password must be less than 32 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*?&#]/, {
      message:
        "Password must contain at least one special character (@, $, !, %, *, ?, &, #).",
    }),
});

export const loginSchema = z.object({
  username: z.string().min(3, {
    message: "Username should be at least 3 characters long.",
  }),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(32, { message: "Password must be less than 32 characters long." })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter.",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter.",
    })
    .regex(/\d/, { message: "Password must contain at least one number." })
    .regex(/[@$!%*?&#]/, {
      message:
        "Password must contain at least one special character (@, $, !, %, *, ?, &, #).",
    }),
});
