import { NextFunction, Request, Response } from 'express';

import { AppError } from '../errors/AppError';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  next(
    new AppError({
      message: `Route not found: ${req.method} ${req.path}`,
      statusCode: 404,
      code: 'ROUTE_NOT_FOUND',
    }),
  );
};

