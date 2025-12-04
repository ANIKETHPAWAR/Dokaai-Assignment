import { Router } from 'express';

import { organizationRepository } from '../container';
import { OrganizationController } from '../controllers/OrganizationController';
import { OrganizationService } from '../services/OrganizationService';

const router = Router();

const organizationService = new OrganizationService(organizationRepository);
const organizationController = new OrganizationController(organizationService);

router.post('/', organizationController.create);
router.get('/', organizationController.list);
router.get('/:id', organizationController.getById);
router.put('/:id', organizationController.update);
router.delete('/:id', organizationController.delete);

export default router;

