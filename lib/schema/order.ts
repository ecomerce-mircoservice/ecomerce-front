import { FieldConfig } from "@/lib/schema/base";
import { z } from "zod";

// --- Schemas (for client-side validation) ---
// These match the server-side schemas in lib/actions/orders.ts
// but are defined here for direct use in forms if needed for client-side validation,
// or as a reference for field configurations.

// Validation schemas
export const addressSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
});

export const createOrderSchema = z.object({
  customerId: z.number().positive("Customer ID is required"),
  shippingAddress: z.string().min(1, "Shipping address is required"),
  items: z.array(
    z.object({
      productId: z.number().positive("Product ID is required"),
      quantity: z.number().int().positive("Quantity must be positive"),
      price: z.number().positive("Price must be positive"),
    })
  ).optional(), // Items are optional - backend pulls from cart if empty
});

export const updateOrderSchema = z.object({
  id: z.number(),
  status: z
    .enum([
      "PENDING",
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional(),
});

export const cancelOrderSchema = z.object({
  id: z.preprocess((val) => Number(val), z.number()),
});

// --- Field Configurations for Forms ---

export const updateOrderRenderedFields: FieldConfig[] = [
  {
    name: "id",
    type: "hidden",
    required: true,
  },
  {
    name: "status",
    label: "Order Status",
    type: "select",
    placeholder: "Select status",
    options: [
      { value: "PENDING", label: "Pending" },
      { value: "CONFIRMED", label: "Confirmed" },
      { value: "PROCESSING", label: "Processing" },
      { value: "SHIPPED", label: "Shipped" },
      { value: "DELIVERED", label: "Delivered" },
      { value: "CANCELLED", label: "Cancelled" },
    ],
    required: true,
  },
];

export const deleteOrderRenderedFields: FieldConfig[] = [
  {
    name: "id",
    type: "hidden",
    required: true,
  },
];
