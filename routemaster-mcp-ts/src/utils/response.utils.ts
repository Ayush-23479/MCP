import { Response } from 'express';

export function sendSuccess<T>(
  res: Response,
  data: T,
  message: string = 'Success',
  statusCode: number = 200
): void {
  res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

export function sendError(
  res: Response,
  error: string,
  statusCode: number = 400
): void {
  res.status(statusCode).json({
    success: false,
    error,
    timestamp: new Date().toISOString(),
  });
}

export function sendHealth(res: Response, port: number, backend: string): void {
  res.json({
    status: '✅ MCP Server is running',
    port,
    backend,
    timestamp: new Date().toISOString(),
  });
}
