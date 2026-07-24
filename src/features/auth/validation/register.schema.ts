import { z } from 'zod';

export const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, { message: 'Email address is required' })
      .email({ message: 'Please enter a valid email address' }),
    password: z
      .string()
      .min(8, { message: 'Secret key must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Must contain at least one number' }),
    confirmPassword: z
      .string()
      .min(1, { message: 'Please confirm your secret key' }),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'You must accept the sacred archivist protocols and terms',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Secret keys do not match',
    path: ['confirmPassword'],
  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;
