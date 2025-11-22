import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/AppError';

interface ErrorResponse {
  success: boolean;
  code: number;
  message: string;
  stack?: string;
}

export const globalErrorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else {
    console.error('Unexpected Error:', err);
  }

  const response: ErrorResponse = {
    success: false,
    code: statusCode,
    message,
  };

  // Include stack trace in development environment
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

