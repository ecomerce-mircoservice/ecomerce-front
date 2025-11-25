"use server";

import { createApiResource } from "../utils/base";
import type { Order, CreateOrderDTO, UpdateOrderDTO } from "@/lib/types/entities/order";

// Create the Orders API resource
export const ordersApi = createApiResource<Order, CreateOrderDTO, UpdateOrderDTO>("orders");

// Order-specific methods
export async function getAllOrders(): Promise<Order[]> {
  return await ordersApi.list();
}

export async function getOrderById(id: string): Promise<Order> {
  return await ordersApi.get(id);
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  return await ordersApi.getAllResource<Order>(`user/${userId}`);
}

export async function createOrder(data: CreateOrderDTO) {
  return await ordersApi.create(data);
}

export async function updateOrderStatus(id: string, status: Order["status"]) {
  return await ordersApi.update(id, { status });
}

export async function cancelOrder(id: string) {
  return await ordersApi.update(id, { status: "cancelled" });
}

export async function getRecentOrders(limit: number = 5): Promise<Order[]> {
  const allOrders = await ordersApi.list();
  return allOrders.slice(0, limit);
}

export async function getOrdersByStatus(status: Order["status"]): Promise<Order[]> {
  const allOrders = await ordersApi.list();
  return allOrders.filter((order) => order.status === status);
}
