import { Router } from 'express';

import { TopicPreferenceController } from '../controllers/TopicPreferenceController';
import {
  NotificationTopicRepository,
  TopicPreferenceRepository,
  UserRepository,
} from '../repositories';
import { TopicPreferenceService } from '../services/TopicPreferenceService';

const router = Router();

const topicPreferenceRepository = new TopicPreferenceRepository();
const userRepository = new UserRepository();
const topicRepository = new NotificationTopicRepository();

const topicPreferenceService = new TopicPreferenceService(
  topicPreferenceRepository,
  userRepository,
  topicRepository,
);
const topicPreferenceController = new TopicPreferenceController(topicPreferenceService);

router.post('/', topicPreferenceController.setPreference);
router.get('/user/:userId', topicPreferenceController.listByUser);
router.delete(
  '/user/:userId/topic/:topicId/channel/:channel',
  topicPreferenceController.deletePreference,
);

export default router;

