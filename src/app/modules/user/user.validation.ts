import { z } from 'zod';

const userUpdateZodSchema = z.object({
  body: z.object({
    role: z
      .enum(['seller', 'buyer'], { required_error: 'Role is required' })
      .optional(),
    phoneNumber: z
      .string({ required_error: 'Phone number is required' })
      .optional(),
    password: z.string({ required_error: 'Password is required' }).optional(),
    name: z
      .object({
        firstName: z
          .string({ required_error: 'First name is required' })
          .optional(),
        lastName: z
          .string({ required_error: 'Last name is required' })
          .optional(),
      })
      .optional(),
    address: z.string({ required_error: 'Address is required' }).optional(),
    budget: z.number().positive().default(0).optional(),
    income: z.number().positive().default(0).optional(),
  }),
});

export const UserValidation = {
  userUpdateZodSchema,
};
