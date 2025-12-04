import { Router } from 'express';

import { NotificationTopicController } from '../controllers/NotificationTopicController';
import {
  NotificationGroupRepository,
  NotificationTopicRepository,
  OrganizationRepository,
} from '../repositories';
import { NotificationTopicService } from '../services/NotificationTopicService';

const router = Router();

const organizationRepository = new OrganizationRepository();
const groupRepository = new NotificationGroupRepository();
const topicRepository = new NotificationTopicRepository();

const topicService = new NotificationTopicService(
  topicRepository,
  groupRepository,
  organizationRepository,
);
const topicController = new NotificationTopicController(topicService);

router.post('/', topicController.create);
router.get('/', topicController.list);
router.get('/:id', topicController.getById);
router.put('/:id', topicController.update);
router.delete('/:id', topicController.delete);

export default router;

