import { z } from 'zod';

export const setGroupPreferenceSchema = z.object({
  userId: z.string().min(1),
  groupId: z.string().min(1),
  isEnabled: z.boolean(),
});

export type SetGroupPreferenceInput = z.infer<typeof setGroupPreferenceSchema>;

