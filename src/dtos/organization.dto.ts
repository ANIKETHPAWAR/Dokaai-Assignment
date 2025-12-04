import { z } from 'zod';

import { Organization } from '../models/organization';

export const metadataSchema = z.record(z.string(), z.any()).optional();

export const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  metadata: metadataSchema,
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;

export const updateOrganizationSchema = createOrganizationSchema
  .partial()
  .extend({
    name: z.string().min(1).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export type UpdateOrganizationInput = z.infer<typeof updateOrganizationSchema>;

export const organizationResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  metadata: metadataSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type OrganizationResponse = Organization;

