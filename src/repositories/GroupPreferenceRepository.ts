import { GroupPreference } from '../models/groupPreference';

import { InMemoryRepository } from './InMemoryRepository';

export class GroupPreferenceRepository extends InMemoryRepository<GroupPreference> {
  findByUserAndGroup(userId: string, groupId: string): GroupPreference | undefined {
    return this.findAll().find(
      (preference) => preference.userId === userId && preference.groupId === groupId,
    );
  }

  findByUser(userId: string): GroupPreference[] {
    return this.findAll().filter((preference) => preference.userId === userId);
  }
}

