import { Router } from 'express';

import { sendSuccess } from '../utils/response';

import notificationGroupRoutes from './notificationGroupRoutes';
import notificationTopicRoutes from './notificationTopicRoutes';
import organizationRoutes from './organizationRoutes';
import userRoutes from './userRoutes';

const router = Router();

router.get('/', (_req, res) => {
  return sendSuccess(res, {
    message: 'Notification preference service API',
    data: { version: 'v1' },
  });
});

router.use('/organizations', organizationRoutes);
router.use('/users', userRoutes);
router.use('/notification-groups', notificationGroupRoutes);
router.use('/notification-topics', notificationTopicRoutes);

export default router;

