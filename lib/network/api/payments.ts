"use server";

import { createApiResource } from "../utils/base";
import type {
  CheckoutRequest,
  CheckoutResponse,
  PaymentVerificationResponse,
} from "@/lib/types/entities/payment";
import { ApiResponse } from "@/lib/types/subTypes/commonTypes";

// Create the Payment API resource - base path is /api/v1/payments
const paymentsApi = createApiResource<
  CheckoutResponse,
  CheckoutRequest,
  CheckoutRequest
>("api/v1/payments");

/**
 * Create a checkout session and get Stripe checkout URL
 */
export async function createCheckoutSession(
  data: CheckoutRequest
): Promise<ApiResponse<CheckoutResponse | null>> {
  try {
    // POST /api/v1/payments/checkout
    const response = await paymentsApi.postResource<
      CheckoutResponse,
      CheckoutRequest
    >("checkout", data);

    return response;
  } catch (error) {
    return {
      success: false,
      code: 500,
      message: (error as Error).message,
      data: null,
    };
  }
}

/**
 * Verify payment status after Stripe redirect
 */
export async function verifyPayment(
  sessionId: string
): Promise<ApiResponse<PaymentVerificationResponse | null>> {
  try {
    // GET /api/v1/payments/verify?session_id=xxx
    const response = await paymentsApi.getResource<PaymentVerificationResponse>(
      `verify?session_id=${sessionId}`
    );

    return {
      success: true,
      code: 200,
      data: response,
      message: "Payment verified successfully",
    };
  } catch (error) {
    return {
      success: false,
      code: 500,
      message: (error as Error).message,
      data: null,
    };
  }
}
