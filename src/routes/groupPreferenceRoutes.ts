import { Router } from 'express';

import {
  groupPreferenceRepository,
  notificationGroupRepository,
  userRepository,
} from '../container';
import { GroupPreferenceController } from '../controllers/GroupPreferenceController';
import { GroupPreferenceService } from '../services/GroupPreferenceService';

const router = Router();

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

