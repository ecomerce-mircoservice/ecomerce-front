// Order Entity Types

export interface Address {
  fullName: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  subtotal?: number;
}

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

// DTOs for Order operations
export interface CreateOrderDTO {
  customerId: number;
  shippingAddress: string;
  items: OrderItem[];
}

export interface UpdateOrderStatusDTO {
  status: OrderStatus;
}

export interface UpdateOrderDTO {
  status?: OrderStatus;
  shippingAddress?: Address;
}

export interface OrderResponse {
  id: number;
  orderNumber: string;
  customerId: number;
  totalAmount: number;
  status: OrderStatus;
  shippingAddress: Address;
  orderItems: OrderItem[];
  createdAt: string;
  updatedAt: string;
}
