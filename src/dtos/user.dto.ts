import { z } from 'zod';

import { metadataSchema } from './organization.dto';

export const createUserSchema = z.object({
  organizationId: z.string().min(1),
  email: z.string().email(),
  phone: z.string().optional(),
  timezone: z.string().optional(),
  isActive: z.boolean().default(true),
  metadata: metadataSchema,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

export const updateUserSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().optional(),
    timezone: z.string().optional(),
    isActive: z.boolean().optional(),
    metadata: metadataSchema,
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateUserInput = z.infer<typeof updateUserSchema>;

