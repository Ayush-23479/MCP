import { Router, Request, Response } from 'express';
import { makeApiCall } from '../services/api.service';
import { sendSuccess, sendError } from '../utils/response.utils';

const router = Router();

/**
 * Health Check - GET /api/optimizer/health
 */
router.get('/health', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('GET', '/api/optimizer/health', undefined, false);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Optimizer health retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Diagnostics - GET /api/optimizer/diagnostics
 */
router.get('/diagnostics', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('GET', '/api/optimizer/diagnostics', undefined, false);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Diagnostics retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Optimize Routes (Flood Fill) - GET /api/optimize-routes
 */
router.get('/optimize-routes', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('GET', '/api/optimizer/optimize-routes', undefined, false);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Route optimization completed (Flood Fill)');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Optimize Routes (Clustering) - GET /api/optimize-clustering
 */
router.get('/optimize-clustering', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('GET', '/api/optimizer/optimize-with-clustering', undefined, false);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Route optimization completed (Clustering)');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get Optimization Stats - GET /api/optimizer/stats
 */
router.get('/stats', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('GET', '/api/optimizer/stats', undefined, false);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Optimization statistics retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

export default router;
