import { Router } from 'express';

import { organizationRepository, userRepository } from '../container';
import { UserController } from '../controllers/UserController';
import { UserService } from '../services/UserService';

const router = Router();

const userService = new UserService(userRepository, organizationRepository);
const userController = new UserController(userService);

router.post('/', userController.create);
router.get('/', userController.list);
router.get('/:id', userController.getById);
router.put('/:id', userController.update);
router.delete('/:id', userController.delete);

export default router;

