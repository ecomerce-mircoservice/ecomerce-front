"use server";

import * as cartApi from "@/lib/network/api/cart";
import { State } from "@/lib/schema/base";
import { revalidatePath } from "next/cache";
import { addToCartSchema, removeFromCartSchema, updateCartItemSchema } from "../schema/cart";
// The utility is already imported here:
import { getCurrentUser } from "@/lib/network/api/auth";

// --- Helper function to retrieve userId and handle auth checks ---
async function getUserIdOrAuthError(): Promise<{ userId: number | null, state: State }> {
    const user = await getCurrentUser();

    if (!user || !user.id) {
        return {
            userId: null,
            state: {
                success: false,
                errors: { userId: ["Authentication required. Please log in."] },
            }
        };
    }
    return { userId: user.id, state: { success: true, errors: {} } };
}
// -----------------------------------------------------------------


// Server Actions
export async function addToCartAction(
    prevState: State,
    formData: FormData
): Promise<State> {
    try {
        const authResult = await getUserIdOrAuthError();

        if (!authResult.userId) {
            return authResult.state;
        }

        const data = {
            userId: authResult.userId,
            productId: Number(formData.get("productId")),
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

        if (!response.success) {
            return {
                success: false,
                errors: { general: [response.message || "Failed to add item to cart"] },
            };
        }

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
        const authResult = await getUserIdOrAuthError();
        if (!authResult.userId) {
            return authResult.state;
        }

        const data = {
            // FIX: Use the securely retrieved ID
            userId: authResult.userId,
            productId: Number(formData.get("productId")),
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
        const authResult = await getUserIdOrAuthError();
        if (!authResult.userId) {
            return authResult.state;
        }

        const data = {
            // FIX: Use the securely retrieved ID
            userId: authResult.userId,
            productId: Number(formData.get("productId")),
        };

        const parsed = removeFromCartSchema.safeParse(data);
        if (!parsed.success) {
            return {
                success: false,
                errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
            };
        }

        const response = await cartApi.removeFromCart(
            parsed.data.productId,
            parsed.data.userId
        );
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
        const authResult = await getUserIdOrAuthError();
        if (!authResult.userId) {
            return authResult.state;
        }

        // FIX: Use the securely retrieved ID
        const userId = authResult.userId;

        const response = await cartApi.clearCart(userId);
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