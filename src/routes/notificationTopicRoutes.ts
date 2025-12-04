import { Router } from 'express';

import {
  notificationGroupRepository,
  notificationTopicRepository,
  organizationRepository,
} from '../container';
import { NotificationTopicController } from '../controllers/NotificationTopicController';
import { NotificationTopicService } from '../services/NotificationTopicService';

const router = Router();

const topicService = new NotificationTopicService(
  notificationTopicRepository,
  notificationGroupRepository,
  organizationRepository,
);
const topicController = new NotificationTopicController(topicService);

router.post('/', topicController.create);
router.get('/', topicController.list);
router.get('/:id', topicController.getById);
router.put('/:id', topicController.update);
router.delete('/:id', topicController.delete);

export default router;

