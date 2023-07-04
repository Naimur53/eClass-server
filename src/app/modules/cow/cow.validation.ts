import mongoose from 'mongoose';
import { z } from 'zod';
const location: [string, ...string[]] = [
  'Dhaka',
  'Chattogram',
  'Barishal',
  'Rajshahi',
  'Sylhet',
  'Comilla',
  'Rangpur',
  'Mymensingh',
];
const breed: [string, ...string[]] = [
  'Brahman',
  'Nellore',
  'Sahiwal',
  'Gir',
  'Indigenous',
  'Tharparkar',
  'Kankrej',
];
const cowZodSchema = z.object({
  body: z.object({
    name: z.string().nonempty('Name is required'),
    age: z.number({ required_error: 'Age must be a number' }),
    price: z.number().positive('Price must be a positive number'),
    location: z.enum([...location], { required_error: 'Invalid location' }),
    breed: z.enum(breed, { required_error: 'Invalid breed' }),
    weight: z.number().positive('Weight must be a positive number'),
    label: z.enum(['for sale', 'sold out'], {
      required_error: 'Invalid label',
    }),
    category: z.enum(['Dairy', 'Beef', 'Dual Purpose'], {
      required_error: 'Invalid category',
    }),
    seller: z
      .string({ required_error: 'Invalid seller id' })
      .refine(mongoose.isValidObjectId),
  }),
});

// cow update zod schema
const cowUpdateZodSchema = z.object({
  body: z.object({
    name: z.string().nonempty('Name is required').optional(),
    age: z.number({ required_error: 'Age must be a number' }).optional(),
    price: z.number().positive('Price must be a positive number').optional(),
    location: z
      .enum([...location], { required_error: 'Invalid location' })
      .optional(),
    breed: z.enum(breed, { required_error: 'Invalid breed' }).optional(),
    weight: z.number().positive('Weight must be a positive number').optional(),
    label: z
      .enum(['for sale', 'sold out'], {
        required_error: 'Invalid label',
      })
      .optional(),
    category: z
      .enum(['Dairy', 'Beef', 'Dual Purpose'], {
        required_error: 'Invalid category',
      })
      .optional(),
    seller: z
      .string({ required_error: 'Invalid seller id' })
      .refine(mongoose.isValidObjectId)
      .optional(),
  }),
});

export const CowZodValidation = {
  cowZodSchema,
  cowUpdateZodSchema,
};
