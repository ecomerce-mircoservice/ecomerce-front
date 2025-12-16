// Payment-related types matching the backend API

export interface CheckoutRequest {
  orderNumber: string;
  customerEmail?: string;
  customerId: number;
  totalAmount: number;
  shippingAddress?: string;
}

export interface CheckoutResponse {
  id: number;
  orderNumber: string;
  customerId: number;
  customerEmail?: string;
  totalAmount: number;
  shippingAddress?: string;
  stripeCheckoutUrl: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentVerificationResponse {
  id: number;
  orderNumber: string;
  customerId: number;
  customerEmail?: string;
  totalAmount: number;
  shippingAddress?: string;
  status: PaymentStatus;
  createdAt: string;
  updatedAt: string;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
}
