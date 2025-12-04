import { NotificationTopic } from '../models/notificationTopic';

import { InMemoryRepository } from './InMemoryRepository';

export class NotificationTopicRepository extends InMemoryRepository<NotificationTopic> {
  findByKey(organizationId: string, key: string): NotificationTopic | undefined {
    return this.findAll().find(
      (topic) => topic.organizationId === organizationId && topic.key === key,
    );
  }

  findByGroup(groupId: string): NotificationTopic[] {
    return this.findAll().filter((topic) => topic.groupId === groupId);
  }

  findByOrganization(organizationId: string): NotificationTopic[] {
    return this.findAll().filter((topic) => topic.organizationId === organizationId);
  }
}

