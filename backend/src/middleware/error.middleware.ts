import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { sendError } from '../utils/response';
import { env } from '../config/env';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public details?: any;

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  // Zod validation error
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return sendError(res, 'Validation failed', 400, 'VALIDATION_ERROR', formattedErrors);
  }

  // Custom App Error
  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code, err.details);
  }

  // Mongoose CastError (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return sendError(res, `Invalid format for field: ${err.path}`, 400, 'INVALID_ID_FORMAT');
  }

  // Mongoose Duplicate Key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return sendError(res, `Duplicate value for ${field}. This record already exists.`, 409, 'DUPLICATE_KEY_ERROR');
  }

  // Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors || {}).map((e: any) => e.message);
    return sendError(res, 'Database validation error', 400, 'DB_VALIDATION_ERROR', messages);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid authentication token', 401, 'INVALID_TOKEN');
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token has expired', 401, 'TOKEN_EXPIRED');
  }

  // General server error
  console.error('💥 Unhandled Error:', err);
  const message = env.NODE_ENV === 'production' ? 'An internal server error occurred' : err.message;
  return sendError(res, message, 500, 'SERVER_ERROR', env.NODE_ENV === 'development' ? err.stack : undefined);
};
