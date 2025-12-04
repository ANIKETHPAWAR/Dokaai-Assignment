import { BaseEntity } from '../models/base';

export type CreateEntityInput<T extends BaseEntity> = Omit<T, keyof BaseEntity> & {
  id?: string;
};

export type UpdateEntityInput<T extends BaseEntity> = Partial<Omit<T, keyof BaseEntity>> & {
  id: string;
};

export interface BaseRepository<T extends BaseEntity> {
  create(payload: CreateEntityInput<T>): T;
  update(payload: UpdateEntityInput<T>): T;
  delete(id: string): void;
  findById(id: string): T | undefined;
  findAll(): T[];
  clear(): void;
  seed(items: T[]): void;
}

