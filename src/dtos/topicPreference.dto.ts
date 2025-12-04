import { z } from 'zod';

export const setTopicPreferenceSchema = z.object({
  userId: z.string().min(1),
  topicId: z.string().min(1),
  channel: z.enum(['email', 'sms', 'push', 'in_app']),
  isEnabled: z.boolean(),
});

export type SetTopicPreferenceInput = z.infer<typeof setTopicPreferenceSchema>;

