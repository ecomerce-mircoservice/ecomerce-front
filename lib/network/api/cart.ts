"use server";

import { createApiResource } from "../utils/base";
import type { Cart, AddToCartDTO, UpdateCartItemDTO, CartResponse } from "@/lib/types/entities/cart";

// Create the Cart API resource
export const cartApi = createApiResource<Cart, AddToCartDTO, UpdateCartItemDTO>("cart");

// Cart-specific methods
export async function getCart(): Promise<CartResponse> {
  // Get the current user's cart
  const response = await cartApi.getResource<CartResponse>("current");
  return response;
}

export async function addToCart(data: AddToCartDTO) {
  return await cartApi.postResource<CartResponse, AddToCartDTO>("add", data);
}

export async function updateCartItem(data: UpdateCartItemDTO) {
  return await cartApi.postResource<CartResponse, UpdateCartItemDTO>("update", data);
}

export async function removeFromCart(productId: string) {
  return await cartApi.deleteResource<CartResponse>(`items/${productId}`);
}

export async function clearCart() {
  return await cartApi.deleteResource<CartResponse>("clear");
}

export async function getCartTotal(): Promise<number> {
  const cart = await getCart();
  return cart.total;
}

export async function getCartItemCount(): Promise<number> {
  const cart = await getCart();
  return cart.itemCount;
}
