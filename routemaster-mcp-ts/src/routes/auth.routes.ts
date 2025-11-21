import { Router, Request, Response } from 'express';
import { makeApiCall, setToken, clearToken } from '../services/api.service';
import { sendSuccess, sendError } from '../utils/response.utils';

const router = Router();

/**
 * Login - POST /api/auth/login
 */
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      sendError(res, 'Email and password are required', 400);
      return;
    }

    const result = await makeApiCall('POST', '/api/auth/login', { email, password }, false);

    if (result.error) {
      sendError(res, result.error, 401);
      return;
    }

    setToken(result.data?.token, result.data);
    sendSuccess(res, {
      message: '✅ Login successful',
      token: result.data?.token,
      user: result.data,
    }, 'Login successful', 200);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Register - POST /api/auth/register
 */
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, firstName, lastName, phone, address } = req.body;

    if (!email || !password || !firstName || !lastName || !phone || !address) {
      sendError(res, 'All fields are required', 400);
      return;
    }

    const userData = { email, password, firstName, lastName, phone, address };
    const result = await makeApiCall('POST', '/api/auth/register', userData, false);

    if (result.error) {
      sendError(res, result.error, 400);
      return;
    }

    sendSuccess(res, result.data, 'Registration successful', 201);
  } catch (error: any) {
    sendError(res, error.message, 500);
  }
});

/**
 * Logout - POST /api/logout
 */
router.post('/logout', (req: Request, res: Response): void => {
  clearToken();
  sendSuccess(res, null, '✅ Logged out successfully');
});

export default router;