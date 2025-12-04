import { Organization } from '../models/organization';

import { InMemoryRepository } from './InMemoryRepository';

export class OrganizationRepository extends InMemoryRepository<Organization> {}

