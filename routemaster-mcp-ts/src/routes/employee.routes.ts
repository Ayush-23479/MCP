import { Router, Request, Response } from 'express';
import { makeApiCall } from '../services/api.service';
import { sendSuccess, sendError } from '../utils/response.utils';

const router = Router();

/**
 * Create Employee - POST /api/employee/create
 */
router.post('/create', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('POST', '/api/employees/create', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, '✅ Employee created successfully', 201);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get All Employees - GET /api/employees
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const pageNumber = req.query.pageNumber || 0;
    const size = req.query.size || 10;
    
    const result = await makeApiCall('GET', `/api/employees?pageNumber=${pageNumber}&size=${size}`);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'All employees retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Update Employee - PUT /api/employee/update
 */
router.put('/update', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('PUT', '/api/employees/update', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, '✅ Employee updated successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Delete Employee - DELETE /api/employee/delete
 */
router.delete('/delete', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('DELETE', '/api/employees/delete', req.body);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, null, '✅ Employee deleted successfully');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

export default router;
