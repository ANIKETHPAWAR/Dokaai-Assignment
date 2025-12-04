import {
  CreateNotificationTopicInput,
  UpdateNotificationTopicInput,
} from '../dtos/notificationTopic.dto';
import { AppError } from '../errors/AppError';
import { NotificationGroup } from '../models/notificationGroup';
import { NotificationTopic } from '../models/notificationTopic';
import {
  CreateEntityInput,
  NotificationGroupRepository,
  NotificationTopicRepository,
  OrganizationRepository,
  UpdateEntityInput,
} from '../repositories';

export class NotificationTopicService {
  constructor(
    private readonly topicRepository: NotificationTopicRepository,
    private readonly groupRepository: NotificationGroupRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  createTopic(payload: CreateNotificationTopicInput): NotificationTopic {
    this.ensureOrganizationExists(payload.organizationId);
    const group = this.ensureGroupExists(payload.groupId);
    if (group.organizationId !== payload.organizationId) {
      throw new AppError({
        message: 'Group does not belong to organization',
        statusCode: 400,
        code: 'GROUP_ORG_MISMATCH',
      });
    }

    const existing = this.topicRepository.findByKey(group.organizationId, payload.key);
    if (existing) {
      throw new AppError({
        message: `Topic key ${payload.key} already exists for organization`,
        statusCode: 409,
        code: 'TOPIC_KEY_EXISTS',
      });
    }

    return this.topicRepository.create(payload as CreateEntityInput<NotificationTopic>);
  }

  listTopics(filters?: { organizationId?: string; groupId?: string }): NotificationTopic[] {
    if (filters?.groupId) {
      this.ensureGroupExists(filters.groupId);
      return this.topicRepository.findByGroup(filters.groupId);
    }

    if (filters?.organizationId) {
      this.ensureOrganizationExists(filters.organizationId);
      return this.topicRepository.findByOrganization(filters.organizationId);
    }

    return this.topicRepository.findAll();
  }

  getTopicById(id: string): NotificationTopic {
    const topic = this.topicRepository.findById(id);
    if (!topic) {
      throw new AppError({
        message: `Topic ${id} not found`,
        statusCode: 404,
        code: 'TOPIC_NOT_FOUND',
      });
    }
    return topic;
  }

  updateTopic(id: string, payload: UpdateNotificationTopicInput): NotificationTopic {
    this.getTopicById(id);
    return this.topicRepository.update({
      id,
      ...payload,
    } as UpdateEntityInput<NotificationTopic>);
  }

  deleteTopic(id: string): void {
    this.getTopicById(id);
    this.topicRepository.delete(id);
  }

  private ensureOrganizationExists(organizationId: string): void {
    const org = this.organizationRepository.findById(organizationId);
    if (!org) {
      throw new AppError({
        message: `Organization ${organizationId} not found`,
        statusCode: 404,
        code: 'ORGANIZATION_NOT_FOUND',
      });
    }
  }

  private ensureGroupExists(groupId: string): NotificationGroup {
    const group = this.groupRepository.findById(groupId);
    if (!group) {
      throw new AppError({
        message: `Group ${groupId} not found`,
        statusCode: 404,
        code: 'GROUP_NOT_FOUND',
      });
    }
    return group;
  }
}

