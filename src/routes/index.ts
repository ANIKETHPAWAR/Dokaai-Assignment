import { Router } from 'express';

import { sendSuccess } from '../utils/response';

const router = Router();

router.get('/', (_req, res) => {
  return sendSuccess(res, {
    message: 'Notification preference service API',
    data: { version: 'v1' },
  });
});

export default router;

