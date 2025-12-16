"use server";

import { State } from "@/lib/schema/base";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "../network/api/auth";
import { getCart } from "../network/api/cart";
import { createCheckoutSession } from "../network/api/payments";
import { CheckoutRequest } from "../types/entities/payment";
import { createApiResource } from "../network/utils/base";
import { CreateOrderDTO, Order } from "../types/main";
import { createOrderSchema } from "../schema/order";

// Create the Orders API resource
const ordersApi = createApiResource<Order, CreateOrderDTO, any>(
  "api/v1/orders"
);

/**
 * Create order and payment checkout session
 * This will:
 * 1. Create an order in the database
 * 2. Create a Stripe checkout session
 * 3. Redirect the user to Stripe for payment
 */
export async function createOrderAndCheckoutAction(
  prevState: State,
  formData: FormData
): Promise<State & { checkoutUrl?: string }> {
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

    // Calculate total from cart
    const cartTotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shipping = cartTotal >= 50 ? 0 : 9.99;
    const tax = cartTotal * 0.08;
    const totalAmount = cartTotal + shipping + tax;

    // Build shipping address as a single string
    const fullName = formData.get("fullName") as string;
    const street = formData.get("street") as string;
    const city = formData.get("city") as string;
    const state = formData.get("state") as string;
    const zipCode = formData.get("zipCode") as string;
    const country = formData.get("country") as string;

    const shippingAddressString = `${fullName}, ${street}, ${city}, ${state} ${zipCode}, ${country}`;

    // STEP 1: Create the order first
    const orderData = {
      customerId: user.id,
      shippingAddress: shippingAddressString,
      items: [], // Empty array - backend will pull from cart automatically
    };

    const parsed = createOrderSchema.safeParse(orderData);
    if (!parsed.success) {
      return {
        success: false,
        errors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
      };
    }

    // Create order in database
    const orderResponse = await ordersApi.create(parsed.data as CreateOrderDTO);

    if (
      !orderResponse.success ||
      !orderResponse.data ||
      !orderResponse.data.id
    ) {
      return {
        success: false,
        errors: { general: ["Failed to create order"] },
      };
    }

    // Generate order number using the order ID
    const orderNumber = `ORD-${orderResponse.data.id}-${Date.now()}`;

    // STEP 2: Create Stripe checkout session with the order number
    const checkoutData: CheckoutRequest = {
      orderNumber,
      customerEmail: user.email,
      customerId: user.id,
      totalAmount: Number(totalAmount.toFixed(2)),
      shippingAddress: shippingAddressString,
    };

    const paymentResponse = await createCheckoutSession(checkoutData);

    if (!paymentResponse.success || !paymentResponse.data) {
      // If payment session creation fails, we still have the order created
      // You might want to handle this differently (e.g., cancel the order)
      return {
        success: false,
        errors: {
          general: [
            paymentResponse.message || "Failed to create checkout session",
          ],
        },
      };
    }

    // Revalidate paths
    revalidatePath("/orders");

    // Get the Stripe checkout URL
    const checkoutUrl = paymentResponse.data.stripeCheckoutUrl;

    console.log("=== RETURNING CHECKOUT URL TO CLIENT ===");
    console.log("Checkout URL:", checkoutUrl);

    // Return the checkout URL to the client for redirect
    return {
      success: true,
      errors: {},
      checkoutUrl,
    };
  } catch (error) {
    console.error("=== SERVER ACTION ERROR ===", error);
    return {
      success: false,
      errors: { general: [(error as Error).message] },
    };
  }
}
