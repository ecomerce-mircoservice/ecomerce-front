"use server";

import { State } from "@/lib/schema/base";
import { revalidatePath } from "next/cache";
import { createApiResource } from "../network/utils/base";
import { createOrderSchema, updateOrderSchema } from "../schema/order";
import { UpdateOrderStatusDTO } from "../types/entities/order";
import { CreateOrderDTO, Order } from "../types/main";
import { getCurrentUser } from "../network/api/auth";
import { getCart, clearCart } from "../network/api/cart";

// Create the Orders API resource - base path is /api/v1/orders
const ordersApi = createApiResource<
  Order,
  CreateOrderDTO,
  UpdateOrderStatusDTO
>("api/v1/orders");


// Server Actions
export async function createOrderAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    // Get current user
    const user = await getCurrentUser();
    if (!user || !user.id) {
      return {
        success: false,
        errors: { general: ["Authentication required"] },
      };
    }

    // Get cart items
    const cart = await getCart(user.id);
    if (!cart || !cart.items || cart.items.length === 0) {
      return {
        success: false,
        errors: { general: ["Cart is empty"] },
      };
    }

    // Build shipping address as a single string (backend requirement)
    const fullName = formData.get("fullName") as string;
    const street = formData.get("street") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zipCode = formData.get("zipCode") as string;
    const country = formData.get("country") as string;

    const shippingAddressString = `${fullName}, ${street}, ${city}, ${state} ${zipCode}, ${country}`;

    const data = {
      customerId: user.id,
      shippingAddress: shippingAddressString,
      items: [], // Empty array - backend will pull from cart automatically
    };

    const parsed = createOrderSchema.safeParse(data);
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    const response = await ordersApi.create(parsed.data);

    // Clear cart after successful order
    await clearCart(user.id);

    revalidatePath("/orders");
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

export async function updateOrderStatusAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  return await ordersApi.updateAction(
    prevState,
    formData,
    updateOrderSchema,
    true,
    ["/admin/orders", "/orders"],
    "id",
    "PUT"
  );
}

export async function cancelOrderAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  try {
    const id = Number(formData.get("id"));

    if (!id) {
      return {
        success: false,
        errors: { id: ["Order ID is required"] },
      };
    }

    const response = await ordersApi.delete(id);
    revalidatePath("/orders");
    revalidatePath("/admin/orders");

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
