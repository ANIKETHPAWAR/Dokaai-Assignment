import { z } from 'zod';

const channelEnum = z.enum(['email', 'sms', 'push', 'in_app']);

export const decisionRequestSchema = z.object({
  organizationId: z.string().min(1),
  userId: z.string().min(1),
  topicId: z.string().min(1),
  channel: channelEnum,
});

export type DecisionRequestInput = z.infer<typeof decisionRequestSchema>;

export const decisionResponseSchema = z.object({
  allowed: z.boolean(),
  reason: z.string(),
  details: z.record(z.string(), z.any()).optional(),
});

export type DecisionResponse = z.infer<typeof decisionResponseSchema>;

