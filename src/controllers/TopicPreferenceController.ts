import { Request, Response } from 'express';

import { setTopicPreferenceSchema } from '../dtos/topicPreference.dto';
import { AppError } from '../errors/AppError';
import { NotificationChannel } from '../models/notificationTopic';
import { TopicPreferenceService } from '../services/TopicPreferenceService';
import { sendSuccess } from '../utils/response';

export class TopicPreferenceController {
  constructor(private readonly topicPreferenceService: TopicPreferenceService) {}

  setPreference = (req: Request, res: Response) => {
    const payload = setTopicPreferenceSchema.parse(req.body);
    const preference = this.topicPreferenceService.setPreference(payload);

    return sendSuccess(res, {
      message: 'Topic channel preference saved',
      data: preference,
    });
  };

  listByUser = (req: Request, res: Response) => {
    const { userId } = req.params;
    if (!userId) {
      throw new AppError({
        message: 'User id is required',
        statusCode: 400,
        code: 'INVALID_USER_ID',
      });
    }

    const preferences = this.topicPreferenceService.getUserPreferences(userId);

    return sendSuccess(res, {
      data: preferences,
    });
  };

  deletePreference = (req: Request, res: Response) => {
    const { userId, topicId, channel } = req.params;

    if (!userId || !topicId || !channel) {
      throw new AppError({
        message: 'User id, topic id, and channel are required',
        statusCode: 400,
        code: 'INVALID_TOPIC_PREFERENCE_PARAMS',
      });
    }

    if (!['email', 'sms', 'push', 'in_app'].includes(channel)) {
      throw new AppError({
        message: 'Invalid channel',
        statusCode: 400,
        code: 'INVALID_CHANNEL',
      });
    }

    this.topicPreferenceService.deletePreference(userId, topicId, channel as NotificationChannel);

    return sendSuccess(res, {
      message: 'Topic channel preference removed',
    });
  };
}

