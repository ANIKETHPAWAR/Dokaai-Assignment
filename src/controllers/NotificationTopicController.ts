import { Request, Response } from 'express';

import {
  createNotificationTopicSchema,
  updateNotificationTopicSchema,
} from '../dtos/notificationTopic.dto';
import { AppError } from '../errors/AppError';
import { NotificationTopicService } from '../services/NotificationTopicService';
import { sendSuccess } from '../utils/response';

export class NotificationTopicController {
  constructor(private readonly topicService: NotificationTopicService) {}

  create = (req: Request, res: Response) => {
    const payload = createNotificationTopicSchema.parse(req.body);
    const topic = this.topicService.createTopic(payload);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Notification topic created',
      data: topic,
    });
  };

  list = (req: Request, res: Response) => {
    const { organizationId, groupId } = req.query;
    const topics = this.topicService.listTopics({
      organizationId: typeof organizationId === 'string' ? organizationId : undefined,
      groupId: typeof groupId === 'string' ? groupId : undefined,
    });

    return sendSuccess(res, {
      data: topics,
    });
  };

  getById = (req: Request, res: Response) => {
    const { id } = req.params;
    this.ensureId(id);

    const topic = this.topicService.getTopicById(id);
    return sendSuccess(res, {
      data: topic,
    });
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;
    this.ensureId(id);

    const payload = updateNotificationTopicSchema.parse(req.body);
    const topic = this.topicService.updateTopic(id, payload);

    return sendSuccess(res, {
      message: 'Notification topic updated',
      data: topic,
    });
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;
    this.ensureId(id);

    this.topicService.deleteTopic(id);

    return sendSuccess(res, {
      message: 'Notification topic deleted',
    });
  };

  private ensureId(id?: string): void {
    if (!id) {
      throw new AppError({
        message: 'Topic id is required',
        statusCode: 400,
        code: 'INVALID_TOPIC_ID',
      });
    }
  }
}

