import mongoose from 'mongoose';
import { z } from 'zod';

const orderCreateZodSchema = z.object({
  body: z.object({
    cow: z
      .string({ required_error: 'Invalid cow id' })
      .refine(mongoose.isValidObjectId),
    buyer: z
      .string({ required_error: 'Invalid buyer id' })
      .refine(mongoose.isValidObjectId),
  }),
});
export const OrderZodSchema = {
  orderCreateZodSchema,
};
