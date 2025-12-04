import { User } from '../models/user';

import { InMemoryRepository } from './InMemoryRepository';

export class UserRepository extends InMemoryRepository<User> {
  findByEmail(email: string): User | undefined {
    return this.findAll().find((user) => user.email === email);
  }
}

