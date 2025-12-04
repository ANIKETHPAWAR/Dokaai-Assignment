import { SetGroupPreferenceInput } from '../dtos/groupPreference.dto';
import { AppError } from '../errors/AppError';
import { GroupPreference } from '../models/groupPreference';
import {
  GroupPreferenceRepository,
  NotificationGroupRepository,
  UserRepository,
} from '../repositories';

export class GroupPreferenceService {
  constructor(
    private readonly groupPreferenceRepository: GroupPreferenceRepository,
    private readonly userRepository: UserRepository,
    private readonly notificationGroupRepository: NotificationGroupRepository,
  ) {}

  setPreference(payload: SetGroupPreferenceInput): GroupPreference {
    const user = this.userRepository.findById(payload.userId);
    if (!user) {
      throw new AppError({
        message: `User ${payload.userId} not found`,
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }

    const group = this.notificationGroupRepository.findById(payload.groupId);
    if (!group) {
      throw new AppError({
        message: `Group ${payload.groupId} not found`,
        statusCode: 404,
        code: 'GROUP_NOT_FOUND',
      });
    }

    if (group.organizationId !== user.organizationId) {
      throw new AppError({
        message: 'User and group belong to different organizations',
        statusCode: 400,
        code: 'GROUP_USER_ORG_MISMATCH',
      });
    }

    const existing = this.groupPreferenceRepository.findByUserAndGroup(payload.userId, payload.groupId);

    if (existing) {
      return this.groupPreferenceRepository.update({
        id: existing.id,
        isEnabled: payload.isEnabled,
      });
    }

    return this.groupPreferenceRepository.create({
      userId: payload.userId,
      groupId: payload.groupId,
      isEnabled: payload.isEnabled,
    });
  }

  getUserPreferences(userId: string): GroupPreference[] {
    this.ensureUserExists(userId);
    return this.groupPreferenceRepository.findByUser(userId);
  }

  deletePreference(userId: string, groupId: string): void {
    const existing = this.groupPreferenceRepository.findByUserAndGroup(userId, groupId);
    if (!existing) {
      throw new AppError({
        message: 'Preference not found',
        statusCode: 404,
        code: 'GROUP_PREFERENCE_NOT_FOUND',
      });
    }
    this.groupPreferenceRepository.delete(existing.id);
  }

  private ensureUserExists(userId: string): void {
    const user = this.userRepository.findById(userId);
    if (!user) {
      throw new AppError({
        message: `User ${userId} not found`,
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }
  }
}

