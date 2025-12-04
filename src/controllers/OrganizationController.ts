import { Request, Response } from 'express';

import {
  createOrganizationSchema,
  updateOrganizationSchema,
} from '../dtos/organization.dto';
import { AppError } from '../errors/AppError';
import { OrganizationService } from '../services/OrganizationService';
import { sendSuccess } from '../utils/response';

export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  create = (req: Request, res: Response) => {
    const data = createOrganizationSchema.parse(req.body);
    const organization = this.organizationService.createOrganization(data);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Organization created',
      data: organization,
    });
  };

  list = (_req: Request, res: Response) => {
    const organizations = this.organizationService.getOrganizations();

    return sendSuccess(res, {
      data: organizations,
    });
  };

  getById = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError({
        message: 'Organization id is required',
        statusCode: 400,
        code: 'INVALID_ORGANIZATION_ID',
      });
    }

    const organization = this.organizationService.getOrganizationById(id);

    return sendSuccess(res, {
      data: organization,
    });
  };

  update = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError({
        message: 'Organization id is required',
        statusCode: 400,
        code: 'INVALID_ORGANIZATION_ID',
      });
    }

    const payload = updateOrganizationSchema.parse(req.body);
    const organization = this.organizationService.updateOrganization(id, payload);

    return sendSuccess(res, {
      message: 'Organization updated',
      data: organization,
    });
  };

  delete = (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new AppError({
        message: 'Organization id is required',
        statusCode: 400,
        code: 'INVALID_ORGANIZATION_ID',
      });
    }

    this.organizationService.deleteOrganization(id);

    return sendSuccess(res, {
      message: 'Organization deleted',
    });
  };
}

