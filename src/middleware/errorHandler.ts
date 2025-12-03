import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError';

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const appError = AppError.fromUnknown(err);

  const responseBody: Record<string, unknown> = {
    success: false,
    code: appError.code,
    message: appError.message,
  };

  if (appError.details) {
    responseBody.details = appError.details;
  }

  console.error('Request failed', {
    path: req.path,
    method: req.method,
    code: appError.code,
    message: appError.message,
  });

  res.status(appError.statusCode).json(responseBody);
};

