import { BaseEntity } from './base';

export type NotificationChannel = 'email' | 'sms' | 'push' | 'in_app';

export interface NotificationTopic extends BaseEntity {
  organizationId: string;
  groupId: string;
  key: string;
  name: string;
  description?: string;
  defaultChannels: NotificationChannel[];
  isCritical: boolean;
}

