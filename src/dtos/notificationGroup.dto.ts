import { z } from 'zod';

export const createNotificationGroupSchema = z.object({
  organizationId: z.string().min(1),
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  isMandatory: z.boolean().default(false),
});

export type CreateNotificationGroupInput = z.infer<typeof createNotificationGroupSchema>;

export const updateNotificationGroupSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    isMandatory: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateNotificationGroupInput = z.infer<typeof updateNotificationGroupSchema>;

