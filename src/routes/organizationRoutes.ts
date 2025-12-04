import { Router } from 'express';

import { OrganizationController } from '../controllers/OrganizationController';
import { OrganizationRepository } from '../repositories';
import { OrganizationService } from '../services/OrganizationService';

const router = Router();

const organizationRepository = new OrganizationRepository();
const organizationService = new OrganizationService(organizationRepository);
const organizationController = new OrganizationController(organizationService);

router.post('/', organizationController.create);
router.get('/', organizationController.list);
router.get('/:id', organizationController.getById);
router.put('/:id', organizationController.update);
router.delete('/:id', organizationController.delete);

export default router;

