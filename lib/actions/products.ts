"use server";

import { z } from "zod";
import { State } from "@/lib/schema/base";
import { productsApi } from "@/lib/network/api/products";
import { revalidatePath } from "next/cache";

// Validation schemas
const createProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be positive"),
  category: z.string().min(1, "Category is required"),
  image: z.string().url("Invalid image URL"),
  stock: z.number().int().nonnegative("Stock must be non-negative"),
  rating: z.number().min(0).max(5).optional(),
});

const updateProductSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.number().positive("Price must be positive").optional(),
  category: z.string().min(1, "Category is required").optional(),
  image: z.string().url("Invalid image URL").optional(),
  stock: z.number().int().nonnegative("Stock must be non-negative").optional(),
  rating: z.number().min(0).max(5).optional(),
});

const deleteProductSchema = z.object({
  id: z.string(),
});

// Server Actions
export async function createProductAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  return await productsApi.createAction(
    prevState,
    formData,
    createProductSchema,
    true,
    ["/admin/products", "/products"]
  );
}

export async function updateProductAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  return await productsApi.updateAction(
    prevState,
    formData,
    updateProductSchema,
    true,
    ["/admin/products", "/products"],
    "id",
    "PUT"
  );
}

export async function deleteProductAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  return await productsApi.deleteAction(
    prevState,
    formData,
    deleteProductSchema,
    ["/admin/products", "/products"],
    "id"
  );
}
