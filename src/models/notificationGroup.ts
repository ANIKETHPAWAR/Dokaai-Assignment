import { BaseEntity } from './base';

export interface NotificationGroup extends BaseEntity {
  organizationId: string;
  key: string;
  name: string;
  description?: string;
  isMandatory: boolean;
}

