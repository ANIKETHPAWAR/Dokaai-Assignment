import { Router } from 'express';

import { DecisionController } from '../controllers/DecisionController';
import {
  GroupPreferenceRepository,
  NotificationGroupRepository,
  NotificationTopicRepository,
  OrganizationRepository,
  TopicPreferenceRepository,
  UserRepository,
} from '../repositories';
import { DecisionService } from '../services/DecisionService';

const router = Router();

const organizationRepository = new OrganizationRepository();
const userRepository = new UserRepository();
const groupRepository = new NotificationGroupRepository();
const topicRepository = new NotificationTopicRepository();
const groupPreferenceRepository = new GroupPreferenceRepository();
const topicPreferenceRepository = new TopicPreferenceRepository();

const decisionService = new DecisionService(
  organizationRepository,
  userRepository,
  groupRepository,
  topicRepository,
  groupPreferenceRepository,
  topicPreferenceRepository,
);

const decisionController = new DecisionController(decisionService);

router.post('/check', decisionController.evaluate);

export default router;

