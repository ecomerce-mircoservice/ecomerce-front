// Cart Entity Types
import type { Product } from "./product";

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  updatedAt: string;
}

// DTOs for Cart operations
export interface AddToCartDTO {
  productId: string;
  quantity: number;
}

export interface UpdateCartItemDTO {
  productId: string;
  quantity: number;
}

export interface RemoveFromCartDTO {
  productId: string;
}

export interface CartResponse {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  itemCount: number;
  updatedAt: string;
}
