import { z } from 'zod';

const channelEnum = z.enum(['email', 'sms', 'push', 'in_app']);

export const createNotificationTopicSchema = z.object({
  organizationId: z.string().min(1),
  groupId: z.string().min(1),
  key: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  defaultChannels: z.array(channelEnum).min(1),
  isCritical: z.boolean().default(false),
});

export type CreateNotificationTopicInput = z.infer<typeof createNotificationTopicSchema>;

export const updateNotificationTopicSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().optional(),
    defaultChannels: z.array(channelEnum).min(1).optional(),
    isCritical: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateNotificationTopicInput = z.infer<typeof updateNotificationTopicSchema>;

