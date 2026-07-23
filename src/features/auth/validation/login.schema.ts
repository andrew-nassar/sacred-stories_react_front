import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Identity / Email is required' })
    .email({ message: 'Please enter a valid email address' }),
  password: z
    .string()
    .min(1, { message: 'Secret Key / Password is required' })
    .min(6, { message: 'Password must be at least 6 characters' }),
  stayLoggedIn: z.boolean(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
