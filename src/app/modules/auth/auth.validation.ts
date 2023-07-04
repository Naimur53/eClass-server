import { z } from 'zod';

const createAuthZodSchema = z.object({
  body: z.object({
    role: z.enum(['seller', 'buyer'], { required_error: 'Role is required' }),
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    password: z.string({ required_error: 'Password is required' }),
    name: z.object({
      firstName: z.string({ required_error: 'First name is required' }),
      lastName: z.string({ required_error: 'Last name is required' }),
    }),
    address: z.string({ required_error: 'Address is required' }),
    budget: z.number().default(0),
    income: z.number().default(0),
  }),
});
const loginZodSchema = z.object({
  body: z.object({
    phoneNumber: z.string({ required_error: 'Phone number is required' }),
    password: z.string({ required_error: 'Password is required' }),
  }),
});
const refreshTokenZodSchema = z.object({
  cookies: z.object({
    refreshToken: z.string({
      required_error: 'Refresh Token is required',
    }),
  }),
});

export const AuthValidation = {
  createAuthZodSchema,
  refreshTokenZodSchema,
  loginZodSchema,
};
