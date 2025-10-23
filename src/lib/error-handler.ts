import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

export interface ApiError extends Error {
  statusCode: number;
  code?: string;
  details?: Record<string, any>;
  isOperational?: boolean;
}

export class AppError extends Error implements ApiError {
  public readonly statusCode: number;
  public readonly code?: string;
  public readonly details?: Record<string, any>;
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
    code?: string,
    details?: Record<string, any>,
    isOperational: boolean = true
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    this.isOperational = isOperational;

    // Maintains proper stack trace for where our error was thrown
    Error.captureStackTrace(this, this.constructor);
  }
}

// Common error types
export const ErrorTypes = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  NOT_FOUND_ERROR: 'NOT_FOUND_ERROR',
  CONFLICT_ERROR: 'CONFLICT_ERROR',
  RATE_LIMIT_ERROR: 'RATE_LIMIT_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR',
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
} as const;

// Error factory functions
export const createValidationError = (message: string, details?: Record<string, any>) =>
  new AppError(message, 400, ErrorTypes.VALIDATION_ERROR, details);

export const createAuthenticationError = (message: string = 'Authentication required') =>
  new AppError(message, 401, ErrorTypes.AUTHENTICATION_ERROR);

export const createAuthorizationError = (message: string = 'Insufficient permissions') =>
  new AppError(message, 403, ErrorTypes.AUTHORIZATION_ERROR);

export const createNotFoundError = (message: string = 'Resource not found') =>
  new AppError(message, 404, ErrorTypes.NOT_FOUND_ERROR);

export const createConflictError = (message: string, details?: Record<string, any>) =>
  new AppError(message, 409, ErrorTypes.CONFLICT_ERROR, details);

export const createRateLimitError = (message: string = 'Rate limit exceeded') =>
  new AppError(message, 429, ErrorTypes.RATE_LIMIT_ERROR);

export const createExternalServiceError = (service: string, message?: string) =>
  new AppError(
    message || `External service error: ${service}`,
    502,
    ErrorTypes.EXTERNAL_SERVICE_ERROR,
    { service }
  );

export const createInternalServerError = (message: string = 'Internal server error') =>
  new AppError(message, 500, ErrorTypes.INTERNAL_SERVER_ERROR);

// Error response formatter
export function formatErrorResponse(error: ApiError, request?: NextRequest): NextResponse {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Log the error
  logger.error('API Error', {
    error: error.message,
    statusCode: error.statusCode,
    code: error.code,
    details: error.details,
    stack: error.stack,
    url: request?.url,
    method: request?.method,
  });

  // Prepare error response
  const errorResponse: any = {
    error: {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
    },
    timestamp: new Date().toISOString(),
    path: request?.url,
  };

  // Include additional details in development
  if (isDevelopment) {
    errorResponse.error.details = error.details;
    errorResponse.error.stack = error.stack;
  }

  // Include request ID if available
  const requestId = request?.headers.get('x-request-id');
  if (requestId) {
    errorResponse.requestId = requestId;
  }

  return NextResponse.json(errorResponse, { status: error.statusCode });
}

// Async error handler wrapper
export function asyncHandler<T extends any[], R>(
  fn: (...args: T) => Promise<R>
) {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      
      // Convert unknown errors to AppError
      const appError = new AppError(
        error instanceof Error ? error.message : 'Unknown error occurred',
        500,
        ErrorTypes.INTERNAL_SERVER_ERROR,
        undefined,
        false
      );
      
      throw appError;
    }
  };
}

// API route error handler
export function handleApiError(error: unknown, request?: NextRequest): NextResponse {
  if (error instanceof AppError) {
    return formatErrorResponse(error, request);
  }

  // Handle other error types
  if (error instanceof Error) {
    const appError = new AppError(
      error.message,
      500,
      ErrorTypes.INTERNAL_SERVER_ERROR,
      undefined,
      false
    );
    return formatErrorResponse(appError, request);
  }

  // Handle unknown errors
  const unknownError = new AppError(
    'An unexpected error occurred',
    500,
    ErrorTypes.INTERNAL_SERVER_ERROR,
    undefined,
    false
  );
  
  return formatErrorResponse(unknownError, request);
}

// Validation helpers
export function validateRequired(value: any, fieldName: string): void {
  if (value === undefined || value === null || value === '') {
    throw createValidationError(`${fieldName} is required`);
  }
}

export function validateEmail(email: string): void {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw createValidationError('Invalid email format');
  }
}

export function validateUrl(url: string): void {
  try {
    new URL(url);
  } catch {
    throw createValidationError('Invalid URL format');
  }
}

export function validatePagination(page: number, limit: number): void {
  if (page < 1) {
    throw createValidationError('Page must be greater than 0');
  }
  if (limit < 1 || limit > 100) {
    throw createValidationError('Limit must be between 1 and 100');
  }
}

// Retry mechanism for external services
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      if (attempt === maxRetries) {
        logger.error(`Operation failed after ${maxRetries} attempts`, {
          error: lastError.message,
          attempts: maxRetries,
        });
        throw createExternalServiceError('Service unavailable', lastError.message);
      }
      
      logger.warn(`Operation failed, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`, {
        error: lastError.message,
        attempt,
        maxRetries,
      });
      
      await new Promise(resolve => setTimeout(resolve, delay));
      delay *= 2; // Exponential backoff
    }
  }
  
  throw lastError!;
}
