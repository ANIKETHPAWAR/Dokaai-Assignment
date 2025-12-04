import { Request, Response } from 'express';

import {
  createNotificationGroupSchema,
  updateNotificationGroupSchema,
} from '../dtos/notificationGroup.dto';
import { AppError } from '../errors/AppError';
import { NotificationGroupService } from '../services/NotificationGroupService';
import { sendSuccess } from '../utils/response';

export class NotificationGroupController {
  constructor(private readonly groupService: NotificationGroupService) {}

  create = (req: Request, res: Response) => {
    const payload = createNotificationGroupSchema.parse(req.body);
    const group = this.groupService.createGroup(payload);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Notification group created',
      data: group,
    });
  };

  list = (req: Request, res: Response) => {
    const { organizationId } = req.query;
    const groups = this.groupService.listGroups(
      typeof organizationId === 'string' ? organizationId : undefined,
    );

    return sendSuccess(res, {
      data: groups,
    });
  };

  getById = (req: Request, res: Response) => {
    const { id } = req.params;
    this.ensureId(id);

    const group = this.groupService.getGroupById(id);
    return sendSuccess(res, {
      data: group,
    });
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    this.ensureId(id);

    const payload = updateNotificationGroupSchema.parse(req.body);
    const group = this.groupService.updateGroup(id, payload);

    return sendSuccess(res, {
      message: 'Notification group updated',
      data: group,
    });
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;
    this.ensureId(id);

    this.groupService.deleteGroup(id);

    return sendSuccess(res, {
      message: 'Notification group deleted',
    });
  };

  private ensureId(id?: string): void {
    if (!id) {
      throw new AppError({
        message: 'Group id is required',
        statusCode: 400,
        code: 'INVALID_GROUP_ID',
      });
    }
  }
}

