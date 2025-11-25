"use server";

import { z } from "zod";
import { State } from "@/lib/schema/base";
import * as cartApi from "@/lib/network/api/cart";
import { revalidatePath } from "next/cache";

// Validation schemas
const addToCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
});

const updateCartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  quantity: z.number().int().nonnegative("Quantity must be non-negative"),
});

const removeFromCartSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
});

// Server Actions
export async function addToCartAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const data = {
      productId: formData.get("productId") as string,
      quantity: Number(formData.get("quantity")),
    };

    const parsed = addToCartSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const response = await cartApi.addToCart(parsed.data);
    revalidatePath("/cart");
    revalidatePath("/");

    return {
      success: true,
      errors: {},
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      errors: { general: [(error as Error).message] },
    };
  }
}

export async function updateCartItemAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const data = {
      productId: formData.get("productId") as string,
      quantity: Number(formData.get("quantity")),
    };

    const parsed = updateCartItemSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const response = await cartApi.updateCartItem(parsed.data);
    revalidatePath("/cart");

    return {
      success: true,
      errors: {},
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      errors: { general: [(error as Error).message] },
    };
  }
}

export async function removeFromCartAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const productId = formData.get("productId") as string;

    const parsed = removeFromCartSchema.safeParse({ productId });
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const response = await cartApi.removeFromCart(productId);
    revalidatePath("/cart");

    return {
      success: true,
      errors: {},
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      errors: { general: [(error as Error).message] },
    };
  }
}

export async function clearCartAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const response = await cartApi.clearCart();
    revalidatePath("/cart");

    return {
      success: true,
      errors: {},
      data: response,
    };
  } catch (error) {
    return {
      success: false,
      errors: { general: [(error as Error).message] },
    };
  }
}
