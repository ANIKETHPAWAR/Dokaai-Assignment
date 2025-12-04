import { NotificationGroup } from '../models/notificationGroup';

import { InMemoryRepository } from './InMemoryRepository';

export class NotificationGroupRepository extends InMemoryRepository<NotificationGroup> {
  findByKey(organizationId: string, key: string): NotificationGroup | undefined {
    return this.findAll().find(
      (group) => group.organizationId === organizationId && group.key === key,
    );
  }

  findByOrganization(organizationId: string): NotificationGroup[] {
    return this.findAll().filter((group) => group.organizationId === organizationId);
  }
}

