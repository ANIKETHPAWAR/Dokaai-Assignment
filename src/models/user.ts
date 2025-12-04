import { BaseEntity } from './base';

export interface User extends BaseEntity {
  organizationId: string;
  email: string;
  phone?: string;
  timezone?: string;
  isActive: boolean;
  metadata?: Record<string, unknown>;
}

