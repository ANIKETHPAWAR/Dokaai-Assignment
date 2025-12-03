import { Response } from 'express';

export interface SuccessResponseOptions<T> {
  message?: string;
  data?: T;
  statusCode?: number;
  meta?: Record<string, unknown>;
}

export const sendSuccess = <T>(
  res: Response,
  { message = 'Success', data, statusCode = 200, meta }: SuccessResponseOptions<T>,
): Response => {
  const payload: Record<string, unknown> = {
    success: true,
    message,
  };

  if (typeof data !== 'undefined') {
    payload.data = data;
  }

  if (meta) {
    payload.meta = meta;
  }

  return res.status(statusCode).json(payload);
};

