import { BaseEntity } from './base';

export interface Organization extends BaseEntity {
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
}

