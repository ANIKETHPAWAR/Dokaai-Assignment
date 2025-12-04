import {
  CreateNotificationGroupInput,
  UpdateNotificationGroupInput,
} from '../dtos/notificationGroup.dto';
import { AppError } from '../errors/AppError';
import { NotificationGroup } from '../models/notificationGroup';
import {
  CreateEntityInput,
  NotificationGroupRepository,
  NotificationTopicRepository,
  OrganizationRepository,
  UpdateEntityInput,
} from '../repositories';

export class NotificationGroupService {
  constructor(
    private readonly groupRepository: NotificationGroupRepository,
    private readonly organizationRepository: OrganizationRepository,
    private readonly topicRepository: NotificationTopicRepository,
  ) {}

  createGroup(payload: CreateNotificationGroupInput): NotificationGroup {
    this.ensureOrganizationExists(payload.organizationId);

    const existing = this.groupRepository.findByKey(payload.organizationId, payload.key);
    if (existing) {
      throw new AppError({
        message: `Group key ${payload.key} already exists for organization`,
        statusCode: 409,
        code: 'GROUP_KEY_EXISTS',
      });
    }

    return this.groupRepository.create(payload as CreateEntityInput<NotificationGroup>);
  }

  listGroups(organizationId?: string): NotificationGroup[] {
    if (organizationId) {
      this.ensureOrganizationExists(organizationId);
      return this.groupRepository.findByOrganization(organizationId);
    }
    return this.groupRepository.findAll();
  }

  getGroupById(id: string): NotificationGroup {
    const group = this.groupRepository.findById(id);
    if (!group) {
      throw new AppError({
        message: `Group ${id} not found`,
        statusCode: 404,
        code: 'GROUP_NOT_FOUND',
      });
    }
    return group;
  }

  updateGroup(id: string, payload: UpdateNotificationGroupInput): NotificationGroup {
    this.getGroupById(id);

    const updated = this.groupRepository.update({
      id,
      ...payload,
    } as UpdateEntityInput<NotificationGroup>);

    return updated;
  }

  deleteGroup(id: string): void {
    const group = this.getGroupById(id);

    const topics = this.topicRepository.findByGroup(group.id);
    if (topics.length > 0) {
      throw new AppError({
        message: 'Cannot delete group with existing topics',
        statusCode: 400,
        code: 'GROUP_HAS_TOPICS',
      });
    }

    this.groupRepository.delete(id);
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
}

