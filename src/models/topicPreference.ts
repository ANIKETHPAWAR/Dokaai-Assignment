import { BaseEntity } from './base';
import { NotificationChannel } from './notificationTopic';

export interface TopicPreference extends BaseEntity {
  userId: string;
  topicId: string;
  channel: NotificationChannel;
  isEnabled: boolean;
}

