import { z } from "zod";

export const registerValidationSchema = z.object({
  name: z.string().min(3),

  email: z.email(),

  password: z.string().min(6),
  image: z.string().optional(),
});

export const loginValidationSchema = z.object({

  email: z.email(),

  password: z.string().min(6),

});

export const updateUserValidationSchema =
  z.object({

    name: z.string().min(3).optional(),

    email: z.email().optional(),

    image: z.string().optional(),

    password: z.string().min(6).optional(),

  });

  export const sendOTPValidationSchema =
  z.object({

    email: z.email(),

  });

  export const verifyOTPValidationSchema =
  z.object({

    email: z.email(),

    otp: z.string().length(6),

  });

  export const resetPasswordValidationSchema =
  z.object({

    email: z.email(),

    password: z.string().min(6),

  });