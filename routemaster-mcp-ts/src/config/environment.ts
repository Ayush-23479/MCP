export const config = {
  PORT: parseInt(process.env.PORT || '3000', 10),
  SPRING_API_BASE: process.env.SPRING_API_BASE || 'http://localhost:8081',
  NODE_ENV: process.env.NODE_ENV || 'development',
  LOG_LEVEL: process.env.LOG_LEVEL || 'info',
};

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  
  // Dashboard
  DASHBOARD_CUSTOMERS: '/dashboard/customercount',
  DASHBOARD_PARCELS: '/dashboard/parcelscount',
  DASHBOARD_PAYMENT: '/dashboard/parcelpayment',
  DASHBOARD_ROUTES: '/dashboard/parcelroutecount',
  
  // Parcels
  PARCELS_CREATE: '/api/parcels/create',
  PARCELS_LIST: '/api/parcels',
  PARCELS_MY: '/api/parcels/my-parcels',
  PARCELS_CUSTOMER: '/api/parcels/customer',
  PARCELS_LAST_MONTH: '/api/parcels/last-month',
  PARCELS_DELAYED: '/api/parcels/delayed',
  PARCELS_UPDATE: '/api/parcels/update',
  PARCELS_DELETE: '/api/parcels/delete',
  
  // Other endpoints...
};