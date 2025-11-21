export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  role: string;
  customerId: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface ParcelRequest {
  parcelId?: number;
  senderName: string;
  destinationAddress: string;
  destinationPincode: string;
  receiverName: string;
  parcelStatus: string;
  createdDate?: string;
  totalPayment: number;
  customerId: number;
  routeId: number;
}

export interface CustomerRequest {
  customerId?: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  password?: string;
}

export interface RouteRequest {
  routeId?: number;
  name: string;
  description: string;
  pincode: string;
  totalDistance: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface User {
  email: string;
  role: string;
  customerId: number;
  firstName: string;
  lastName: string;
}