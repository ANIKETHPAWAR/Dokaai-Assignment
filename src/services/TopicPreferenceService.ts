import { SetTopicPreferenceInput } from '../dtos/topicPreference.dto';
import { AppError } from '../errors/AppError';
import {
  NotificationTopicRepository,
  TopicPreferenceRepository,
  UserRepository,
} from '../repositories';

export class TopicPreferenceService {
  constructor(
    private readonly topicPreferenceRepository: TopicPreferenceRepository,
    private readonly userRepository: UserRepository,
    private readonly topicRepository: NotificationTopicRepository,
  ) {}

  setPreference(payload: SetTopicPreferenceInput) {
    const user = this.userRepository.findById(payload.userId);
    if (!user) {
      throw new AppError({
        message: `User ${payload.userId} not found`,
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }

    const topic = this.topicRepository.findById(payload.topicId);
    if (!topic) {
      throw new AppError({
        message: `Topic ${payload.topicId} not found`,
        statusCode: 404,
        code: 'TOPIC_NOT_FOUND',
      });
    }

    if (topic.organizationId !== user.organizationId) {
      throw new AppError({
        message: 'User and topic belong to different organizations',
        statusCode: 400,
        code: 'TOPIC_USER_ORG_MISMATCH',
      });
    }

    const existing = this.topicPreferenceRepository.findByUserTopicAndChannel(
      payload.userId,
      payload.topicId,
      payload.channel,
    );

    if (existing) {
      return this.topicPreferenceRepository.update({
        id: existing.id,
        isEnabled: payload.isEnabled,
      });
    }

    return this.topicPreferenceRepository.create(payload);
  }

  getUserPreferences(userId: string) {
    this.ensureUserExists(userId);
    return this.topicPreferenceRepository.findByUser(userId);
  }

  deletePreference(
    userId: string,
    topicId: string,
    channel: SetTopicPreferenceInput['channel'],
  ): void {
    const existing = this.topicPreferenceRepository.findByUserTopicAndChannel(
      userId,
      topicId,
      channel,
    );

    if (!existing) {
      throw new AppError({
        message: 'Topic preference not found',
        statusCode: 404,
        code: 'TOPIC_PREFERENCE_NOT_FOUND',
      });
    }

    this.topicPreferenceRepository.delete(existing.id);
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

