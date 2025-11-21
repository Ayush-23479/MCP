import { Router, Request, Response } from 'express';
import { makeApiCall } from '../services/api.service';
import { sendSuccess, sendError } from '../utils/response.utils';

const router = Router();

/**
 * Create Route - POST /api/route/create
 */
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, pincode, totalDistance } = req.body;
    
    if (!name || !description || !pincode || totalDistance === undefined) {
      sendError(res, 'All fields are required', 400);
      return;
    }

    const result = await makeApiCall('POST', '/api/routes/create', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, '✅ Route created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get All Routes - GET /api/routes
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = req.query.pageNumber || 0;
    const size = req.query.size || 10;
    
    const result = await makeApiCall('GET', `/api/routes?pageNumber=${pageNumber}&size=${size}`);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'All routes retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Update Route - PUT /api/route/update
 */
router.put('/update', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('PUT', '/api/routes/update', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, '✅ Route updated successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Delete Route - DELETE /api/route/delete
 */
router.delete('/delete', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('DELETE', '/api/routes/delete', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, null, '✅ Route deleted successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

export default router;