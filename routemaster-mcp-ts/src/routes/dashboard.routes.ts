import { Router, Request, Response } from 'express';
import { makeApiCall } from '../services/api.service';
import { sendSuccess, sendError } from '../utils/response.utils';

const router = Router();

/**
 * Get Customer Count - GET /dashboard/customercount
 */
router.get('/customercount', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('GET', '/dashboard/customercount', undefined, false);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Customer count retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get Parcel Count - GET /dashboard/parcelscount
 */
router.get('/parcelscount', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('GET', '/dashboard/parcelscount', undefined, false);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Parcel count retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get Total Payment - GET /dashboard/parcelpayment
 */
router.get('/parcelpayment', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('GET', '/dashboard/parcelpayment', undefined, false);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Total payment retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Get Parcel Count Per Route - GET /dashboard/parcelroutecount
 */
router.get('/parcelroutecount', async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await makeApiCall('GET', '/dashboard/parcelroutecount', undefined, false);
    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }
    sendSuccess(res, result.data, 'Parcel count per route retrieved');
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

export default router;