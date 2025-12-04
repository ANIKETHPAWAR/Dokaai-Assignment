import { Router } from 'express';

import { NotificationGroupController } from '../controllers/NotificationGroupController';
import {
  NotificationGroupRepository,
  NotificationTopicRepository,
  OrganizationRepository,
} from '../repositories';
import { NotificationGroupService } from '../services/NotificationGroupService';

const router = Router();

const organizationRepository = new OrganizationRepository();
const groupRepository = new NotificationGroupRepository();
const topicRepository = new NotificationTopicRepository();

const groupService = new NotificationGroupService(
  groupRepository,
  organizationRepository,
  topicRepository,
);
const groupController = new NotificationGroupController(groupService);

router.post('/', groupController.create);
router.get('/', groupController.list);
router.get('/:id', groupController.getById);
router.put('/:id', groupController.update);
router.delete('/:id', groupController.delete);

export default router;

