import { Request, Response } from 'express';

export function errorHandler(
  err: any,
  req: Request,
  res: Response
): void {
  console.error('Error:', err.message);

  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString(),
  });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path,
    method: req.method,
  });
}