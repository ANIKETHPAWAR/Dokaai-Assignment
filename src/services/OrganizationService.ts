import {
  CreateOrganizationInput,
  UpdateOrganizationInput,
} from '../dtos/organization.dto';
import { AppError } from '../errors/AppError';
import { Organization } from '../models/organization';
import {
  CreateEntityInput,
  OrganizationRepository,
  UpdateEntityInput,
} from '../repositories';

export class OrganizationService {
  constructor(private readonly organizationRepository: OrganizationRepository) {}

  createOrganization(payload: CreateOrganizationInput): Organization {
    const organization = this.organizationRepository.create(payload as CreateEntityInput<Organization>);
    return organization;
  }

  getOrganizations(): Organization[] {
    return this.organizationRepository.findAll();
  }

  getOrganizationById(id: string): Organization {
    const organization = this.organizationRepository.findById(id);

    if (!organization) {
      throw new AppError({
        message: `Organization ${id} not found`,
        statusCode: 404,
        code: 'ORGANIZATION_NOT_FOUND',
      });
    }

    return organization;
  }

  updateOrganization(id: string, payload: UpdateOrganizationInput): Organization {
    this.getOrganizationById(id);
    const updated = this.organizationRepository.update({
      id,
      ...payload,
    } as UpdateEntityInput<Organization>);

    return updated;
  }

  deleteOrganization(id: string): void {
    this.getOrganizationById(id);
    this.organizationRepository.delete(id);
  }
}

