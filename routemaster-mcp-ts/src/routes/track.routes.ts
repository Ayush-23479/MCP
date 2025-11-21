import { Router, Request, Response } from 'express';
import { makeApiCall } from '../services/api.service';
import { sendSuccess, sendError } from '../utils/response.utils';

const router = Router();

/**
 * Create Tracking Entry - POST /api/track/create
 */
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('POST', '/api/track/create', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, '✅ Tracking entry created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get All Tracking Records - GET /api/track
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = req.query.pageNumber || 0;
    const size = req.query.size || 10;
    
    const result = await makeApiCall('GET', `/api/track?pageNumber=${pageNumber}&size=${size}`);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'All tracking records retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Update Tracking Entry - PUT /api/track/update
 */
router.put('/update', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('PUT', '/api/track/update', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, '✅ Tracking entry updated successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Delete Tracking Entry - DELETE /api/track/delete
 */
router.delete('/delete', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('DELETE', '/api/track/delete', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, null, '✅ Tracking entry deleted successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

export default router;