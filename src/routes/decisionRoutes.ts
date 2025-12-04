import { Router } from 'express';

import {
  groupPreferenceRepository,
  notificationGroupRepository,
  notificationTopicRepository,
  organizationRepository,
  topicPreferenceRepository,
  userRepository,
} from '../container';
import { DecisionController } from '../controllers/DecisionController';
import { DecisionService } from '../services/DecisionService';

const router = Router();

const decisionService = new DecisionService(
  organizationRepository,
  userRepository,
  notificationGroupRepository,
  notificationTopicRepository,
  groupPreferenceRepository,
  topicPreferenceRepository,
);

const decisionController = new DecisionController(decisionService);

router.post('/check', decisionController.evaluate);

export default router;

