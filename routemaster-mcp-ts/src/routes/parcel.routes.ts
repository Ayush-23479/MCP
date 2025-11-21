import { Router, Request, Response } from 'express';
import { makeApiCall } from '../services/api.service';
import { sendSuccess, sendError } from '../utils/response.utils';

const router = Router();

/**
 * Create Parcel - POST /api/parcel/create
 */
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('POST', '/api/parcels/create', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, '✅ Parcel created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get All Parcels - GET /api/parcels
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = req.query.pageNumber || 0;
    const size = req.query.size || 10;
    
    const result = await makeApiCall('GET', `/api/parcels?pageNumber=${pageNumber}&size=${size}`);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Parcels retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get My Parcels (Current User) - GET /api/parcels/my-parcels
 */
router.get('/my-parcels', async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = req.query.pageNumber || 0;
    const size = req.query.size || 10;
    
    const result = await makeApiCall('GET', `/api/parcels/my-parcels?pageNumber=${pageNumber}&size=${size}`);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'My parcels retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get Parcels by Customer - GET /api/parcels/customer/:customerId
 */
router.get('/customer/:customerId', async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerId } = req.params;
    const pageNumber = req.query.pageNumber || 0;
    const size = req.query.size || 10;
    
    const result = await makeApiCall(
      'GET',
      `/api/parcels/customer/${customerId}?pageNumber=${pageNumber}&size=${size}`
    );
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, `Parcels for customer ${customerId} retrieved`);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get Last Month Parcels - GET /api/parcels/last-month
 */
router.get('/last-month', async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = req.query.pageNumber || 0;
    const size = req.query.size || 10;
    
    const result = await makeApiCall('GET', `/api/parcels/last-month?pageNumber=${pageNumber}&size=${size}`);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Last month parcels retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get Delayed Parcels - GET /api/parcels/delayed
 */
router.get('/delayed', async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = req.query.pageNumber || 0;
    const size = req.query.size || 10;
    
    const result = await makeApiCall('GET', `/api/parcels/delayed?pageNumber=${pageNumber}&size=${size}`);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Delayed parcels retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Update Parcel - PUT /api/parcel/update
 */
router.put('/update', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('PUT', '/api/parcels/update', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, '✅ Parcel updated successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Delete Parcel - DELETE /api/parcel/delete
 */
router.delete('/delete', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('DELETE', '/api/parcels/delete', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, null, '✅ Parcel deleted successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

export default router;