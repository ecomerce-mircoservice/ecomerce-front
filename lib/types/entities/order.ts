// Order Entity Types
import type { CartItem } from "./cart";

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}

// DTOs for Order operations
export interface CreateOrderDTO {
  shippingAddress: Address;
}

export interface UpdateOrderDTO {
  status?: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress?: Address;
}

export interface OrderResponse {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
}
