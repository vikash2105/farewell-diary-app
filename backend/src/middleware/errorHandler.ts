import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

/**
 * Custom API Error
 */
export class ApiError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this, this.constructor);
  }
}

interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
  stack?: string;
}

/**
 * Global error handler
 */
export const errorHandler = (
  err: Error | ApiError | ZodError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  let statusCode = 500;
  let message = "Internal server error";
  let details: any;

  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation error";
    details = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));
  } else if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  }

  logger.error("Request failed", {
    statusCode,
    message: err.message,
    stack: err.stack,
  });

  const response: ErrorResponse = {
    success: false,
    error: message,
    details,
  };

  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * 404 handler
 */
export const notFoundHandler = (_req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
};
