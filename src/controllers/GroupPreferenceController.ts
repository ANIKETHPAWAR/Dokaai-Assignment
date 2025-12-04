import { Request, Response } from 'express';

import { setGroupPreferenceSchema } from '../dtos/groupPreference.dto';
import { AppError } from '../errors/AppError';
import { GroupPreferenceService } from '../services/GroupPreferenceService';
import { sendSuccess } from '../utils/response';

export class GroupPreferenceController {
  constructor(private readonly groupPreferenceService: GroupPreferenceService) {}

  setPreference = (req: Request, res: Response) => {
    const payload = setGroupPreferenceSchema.parse(req.body);
    const preference = this.groupPreferenceService.setPreference(payload);

    return sendSuccess(res, {
      message: 'Group preference saved',
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

    const preferences = this.groupPreferenceService.getUserPreferences(userId);
    return sendSuccess(res, {
      data: preferences,
    });
  };

  deletePreference = (req: Request, res: Response) => {
    const { userId, groupId } = req.params;
    if (!userId || !groupId) {
      throw new AppError({
        message: 'User id and group id are required',
        statusCode: 400,
        code: 'INVALID_GROUP_PREFERENCE_PARAMS',
      });
    }

    this.groupPreferenceService.deletePreference(userId, groupId);

    return sendSuccess(res, {
      message: 'Group preference removed',
    });
  };
}

