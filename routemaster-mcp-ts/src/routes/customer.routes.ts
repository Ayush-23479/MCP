import { Router, Request, Response } from 'express';
import { makeApiCall } from '../services/api.service';
import { sendSuccess, sendError } from '../utils/response.utils';

const router = Router();

/**
 * Get Current User Profile - GET /api/customers/me
 */
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('GET', '/api/customers/me');
    if (result.error) {
      sendError(res, result.error, 404);
      return;
    }
    sendSuccess(res, result.data, 'Customer profile retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Create Customer - POST /api/customer/create
 */
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, phone, email, address, password } = req.body;
    
    if (!firstName || !lastName || !phone || !email || !address) {
      sendError(res, 'All fields are required', 400);
      return;
    }

    const result = await makeApiCall('POST', '/api/customers/create', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, '✅ Customer created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get All Customers - GET /api/customers
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = req.query.pageNumber || 0;
    const size = req.query.size || 10;
    
    const result = await makeApiCall('GET', `/api/customers?pageNumber=${pageNumber}&size=${size}`);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'All customers retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Update Customer - PUT /api/customer/update
 */
router.put('/update', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('PUT', '/api/customers/update', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, '✅ Customer updated successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Delete Customer - DELETE /api/customer/delete
 */
router.delete('/delete', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('DELETE', '/api/customers/delete', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, null, '✅ Customer deleted successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

export default router;