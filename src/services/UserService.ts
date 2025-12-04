import { CreateUserInput, UpdateUserInput } from '../dtos/user.dto';
import { AppError } from '../errors/AppError';
import { User } from '../models/user';
import {
  CreateEntityInput,
  OrganizationRepository,
  UpdateEntityInput,
  UserRepository,
} from '../repositories';

export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  createUser(payload: CreateUserInput): User {
    this.ensureOrganizationExists(payload.organizationId);

    const existing = this.userRepository.findByEmail(payload.email);
    if (existing) {
      throw new AppError({
        message: `User with email ${payload.email} already exists`,
        statusCode: 409,
        code: 'USER_EMAIL_EXISTS',
      });
    }

    const user = this.userRepository.create(payload as CreateEntityInput<User>);
    return user;
  }

  listUsers(): User[] {
    return this.userRepository.findAll();
  }

  getUserById(id: string): User {
    const user = this.userRepository.findById(id);
    if (!user) {
      throw new AppError({
        message: `User ${id} not found`,
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }
    return user;
  }

  updateUser(id: string, payload: UpdateUserInput): User {
    const user = this.getUserById(id);

    if (payload.email && payload.email !== user.email) {
      const existing = this.userRepository.findByEmail(payload.email);
      if (existing) {
        throw new AppError({
          message: `User with email ${payload.email} already exists`,
          statusCode: 409,
          code: 'USER_EMAIL_EXISTS',
        });
      }
    }

    const updated = this.userRepository.update({
      id,
      ...payload,
    } as UpdateEntityInput<User>);

    return updated;
  }

  deleteUser(id: string): void {
    this.getUserById(id);
    this.userRepository.delete(id);
  }

  private ensureOrganizationExists(organizationId: string): void {
    const organization = this.organizationRepository.findById(organizationId);
    if (!organization) {
      throw new AppError({
        message: `Organization ${organizationId} not found`,
        statusCode: 404,
        code: 'ORGANIZATION_NOT_FOUND',
      });
    }
  }
}

