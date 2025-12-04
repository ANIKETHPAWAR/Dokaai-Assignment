import { BaseEntity } from './base';

export interface GroupPreference extends BaseEntity {
  userId: string;
  groupId: string;
  isEnabled: boolean;
}

