import { DecisionRequestInput } from '../dtos/decision.dto';
import { AppError } from '../errors/AppError';
import { NotificationChannel } from '../models/notificationTopic';
import {
  GroupPreferenceRepository,
  NotificationGroupRepository,
  NotificationTopicRepository,
  OrganizationRepository,
  TopicPreferenceRepository,
  UserRepository,
} from '../repositories';

interface DecisionResult {
  allowed: boolean;
  reason: string;
  details?: Record<string, unknown>;
}

export class DecisionService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly userRepository: UserRepository,
    private readonly groupRepository: NotificationGroupRepository,
    private readonly topicRepository: NotificationTopicRepository,
    private readonly groupPreferenceRepository: GroupPreferenceRepository,
    private readonly topicPreferenceRepository: TopicPreferenceRepository,
  ) {}

  evaluate(request: DecisionRequestInput): DecisionResult {
    const { organizationId, userId, topicId, channel } = request;

    const organization = this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new AppError({
        message: `Organization ${organizationId} not found`,
        statusCode: 404,
        code: 'ORGANIZATION_NOT_FOUND',
      });
    }

    const user = this.userRepository.findById(userId);
    if (!user || user.organizationId !== organizationId) {
      throw new AppError({
        message: `User ${userId} not found in organization`,
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }

    if (!user.isActive) {
      return this.deny('USER_INACTIVE', { userId });
    }

    const topic = this.topicRepository.findById(topicId);
    if (!topic || topic.organizationId !== organizationId) {
      throw new AppError({
        message: `Topic ${topicId} not found in organization`,
        statusCode: 404,
        code: 'TOPIC_NOT_FOUND',
      });
    }

    const group = this.groupRepository.findById(topic.groupId);
    if (!group || group.organizationId !== organizationId) {
      throw new AppError({
        message: `Group ${topic.groupId} not found in organization`,
        statusCode: 404,
        code: 'GROUP_NOT_FOUND',
      });
    }

    if (group.isMandatory) {
      return this.allow('GROUP_MANDATORY', { groupId: group.id });
    }

    const groupPreference = this.groupPreferenceRepository.findByUserAndGroup(userId, group.id);
    if (groupPreference && groupPreference.isEnabled === false) {
      return this.deny('GROUP_PREFERENCE_DISABLED', { groupId: group.id });
    }

    const topicPreference = this.topicPreferenceRepository.findByUserTopicAndChannel(
      userId,
      topicId,
      channel,
    );

    if (topicPreference) {
      if (topicPreference.isEnabled) {
        return this.allow('TOPIC_CHANNEL_ENABLED', { topicId, channel });
      }
      return this.deny('TOPIC_CHANNEL_DISABLED', { topicId, channel });
    }

    if (!this.topicSupportsChannel(topic.defaultChannels, channel)) {
      return this.deny('CHANNEL_NOT_SUPPORTED', { topicId, channel });
    }

    return this.allow('DEFAULT_ALLOWED', { topicId, channel });
  }

  private allow(reason: string, details?: Record<string, unknown>): DecisionResult {
    return { allowed: true, reason, details };
  }

  private deny(reason: string, details?: Record<string, unknown>): DecisionResult {
    return { allowed: false, reason, details };
  }

  private topicSupportsChannel(defaults: NotificationChannel[], channel: NotificationChannel): boolean {
    return defaults.includes(channel);
  }
}

