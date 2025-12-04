import { BaseEntity } from '../models/base';
import { generateId } from '../utils/id';

import {
  BaseRepository,
  CreateEntityInput,
  UpdateEntityInput,
} from './BaseRepository';

export class InMemoryRepository<T extends BaseEntity> implements BaseRepository<T> {
  protected items: Map<string, T>;

  constructor(seed: T[] = []) {
    this.items = new Map(seed.map((item) => [item.id, item]));
  }

  create(payload: CreateEntityInput<T>): T {
    const now = new Date();
    const id = payload.id ?? generateId();
    const entity = {
      ...payload,
      id,
      createdAt: now,
      updatedAt: now,
    } as T;

    this.items.set(id, entity);
    return entity;
  }

  update(payload: UpdateEntityInput<T>): T {
    const existing = this.items.get(payload.id);

    if (!existing) {
      throw new Error(`Entity with id ${payload.id} not found`);
    }

    const updated: T = {
      ...existing,
      ...payload,
      id: existing.id,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    };

    this.items.set(updated.id, updated);
    return updated;
  }

  delete(id: string): void {
    this.items.delete(id);
  }

  findById(id: string): T | undefined {
    return this.items.get(id);
  }

  findAll(): T[] {
    return Array.from(this.items.values());
  }

  clear(): void {
    this.items.clear();
  }

  seed(items: T[]): void {
    this.clear();
    items.forEach((item) => {
      this.items.set(item.id, item);
    });
  }
}

