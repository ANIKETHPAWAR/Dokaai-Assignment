import { Router } from 'express';

import { GroupPreferenceController } from '../controllers/GroupPreferenceController';
import {
  GroupPreferenceRepository,
  NotificationGroupRepository,
  UserRepository,
} from '../repositories';
import { GroupPreferenceService } from '../services/GroupPreferenceService';

const router = Router();

const groupPreferenceRepository = new GroupPreferenceRepository();
const userRepository = new UserRepository();
const notificationGroupRepository = new NotificationGroupRepository();

const groupPreferenceService = new GroupPreferenceService(
  groupPreferenceRepository,
  userRepository,
  notificationGroupRepository,
);
const groupPreferenceController = new GroupPreferenceController(groupPreferenceService);

router.post('/', groupPreferenceController.setPreference);
router.get('/user/:userId', groupPreferenceController.listByUser);
router.delete('/user/:userId/group/:groupId', groupPreferenceController.deletePreference);

export default router;

