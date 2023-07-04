import { z } from 'zod';

const adminUpdateZodSchema = z.object({
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

const createAdminZodSchema = z.object({
  body: z.object({
    role: z.enum(['admin'], { required_error: 'Role is required' }),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    password: z.string({ required_error: 'Password is required' }),
    name: z.object({
      firstName: z.string({ required_error: 'First name is required' }),
      lastName: z.string({ required_error: 'Last name is required' }),
    }),
    address: z.string({ required_error: 'Address is required' }),
  }),
});
const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const AdminValidation = {
  adminUpdateZodSchema,
  createAdminZodSchema,
  loginZodSchema,
};
