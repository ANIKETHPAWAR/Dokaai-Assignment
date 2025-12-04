import { Router } from 'express';

import {
  notificationTopicRepository,
  topicPreferenceRepository,
  userRepository,
} from '../container';
import { TopicPreferenceController } from '../controllers/TopicPreferenceController';
import { TopicPreferenceService } from '../services/TopicPreferenceService';

const router = Router();

const topicPreferenceService = new TopicPreferenceService(
  topicPreferenceRepository,
  userRepository,
  notificationTopicRepository,
);
const topicPreferenceController = new TopicPreferenceController(topicPreferenceService);

router.post('/', topicPreferenceController.setPreference);
router.get('/user/:userId', topicPreferenceController.listByUser);
router.delete(
  '/user/:userId/topic/:topicId/channel/:channel',
  topicPreferenceController.deletePreference,
);

export default router;

