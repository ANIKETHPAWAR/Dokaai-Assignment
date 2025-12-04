export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EntityId = BaseEntity['id'];

export interface Auditable {
  createdBy?: string;
  updatedBy?: string;
}

export type WithTimestamps<T extends object> = T & {
  createdAt: Date;
  updatedAt: Date;
};

export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

