export type AppErrorContext = Record<string, unknown>;

export interface AppErrorParams {
  message: string;
  statusCode?: number;
  code?: string;
  details?: AppErrorContext;
}

export class AppError extends Error {
  public readonly statusCode: number;

  public readonly code: string;

  public readonly details?: AppErrorContext;

  constructor({ message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR', details }: AppErrorParams) {
    super(message);

    this.statusCode = statusCode;
    this.code = code;
    this.details = details;

    Error.captureStackTrace?.(this, this.constructor);
  }

  static fromUnknown(error: unknown): AppError {
    if (error instanceof AppError) {
      return error;
    }

    if (error instanceof Error) {
      return new AppError({
        message: error.message,
        statusCode: 500,
        code: 'INTERNAL_SERVER_ERROR',
        details: { originalName: error.name },
      });
    }

    return new AppError({
      message: 'An unexpected error occurred',
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
    });
  }
}

