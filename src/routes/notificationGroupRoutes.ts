import { Router } from 'express';

import {
  notificationGroupRepository,
  notificationTopicRepository,
  organizationRepository,
} from '../container';
import { NotificationGroupController } from '../controllers/NotificationGroupController';
import { NotificationGroupService } from '../services/NotificationGroupService';

const router = Router();

const groupService = new NotificationGroupService(
  notificationGroupRepository,
  organizationRepository,
  notificationTopicRepository,
);
const groupController = new NotificationGroupController(groupService);

router.post('/', groupController.create);
router.get('/', groupController.list);
router.get('/:id', groupController.getById);
router.put('/:id', groupController.update);
router.delete('/:id', groupController.delete);

export default router;

