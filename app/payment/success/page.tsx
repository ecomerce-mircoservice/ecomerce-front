"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { verifyPayment } from "@/lib/network/api/payments";
import { PaymentStatus } from "@/lib/types/entities/payment";
import { clearCart } from "@/lib/network/api/cart";
import { getCurrentUser } from "@/lib/network/api/auth";

type VerificationStatus = "verifying" | "success" | "pending" | "error";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      setStatus("error");
      return;
    }

    verifyPaymentStatus(sessionId);
  }, [searchParams]);

  const verifyPaymentStatus = async (sessionId: string) => {
    try {
      const response = await verifyPayment(sessionId);

      if (!response.success || !response.data) {
        setStatus("error");
        return;
      }

      setPaymentData(response.data);

      if (response.data.status === PaymentStatus.COMPLETED) {
        setStatus("success");

        // Clear the cart after successful payment
        try {
          const user = await getCurrentUser();
          if (user?.id) {
            await clearCart(user.id);
          }
        } catch (error) {
          console.error("Failed to clear cart:", error);
        }

        // Redirect to orders page after 3 seconds
        setTimeout(() => router.push("/orders"), 3000);
      } else if (response.data.status === PaymentStatus.PENDING) {
        setStatus("pending");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Verification error:", error);
      setStatus("error");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Payment Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === "verifying" && (
              <div className="text-center space-y-4">
                <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
                <h2 className="text-xl font-semibold">
                  Verifying your payment...
                </h2>
                <p className="text-muted-foreground">
                  Please wait while we confirm your payment.
                </p>
              </div>
            )}

            {status === "success" && paymentData && (
              <div className="text-center space-y-4">
                <CheckCircle2 className="h-16 w-16 mx-auto text-green-500" />
                <h2 className="text-xl font-semibold text-green-600">
                  Payment Successful!
                </h2>
                <p className="text-muted-foreground">
                  Thank you for your payment.
                </p>
                <div className="bg-muted p-4 rounded-lg space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="font-medium">Order Number:</span>
                    <span className="text-muted-foreground">
                      {paymentData.orderNumber}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Amount:</span>
                    <span className="text-muted-foreground">
                      ${paymentData.totalAmount.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <span className="text-green-600 font-semibold">
                      {paymentData.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Redirecting to your orders in 3 seconds...
                </p>
                <Button onClick={() => router.push("/orders")} className="mt-4">
                  View Orders Now
                </Button>
              </div>
            )}

            {status === "pending" && (
              <div className="text-center space-y-4">
                <AlertCircle className="h-16 w-16 mx-auto text-yellow-500" />
                <h2 className="text-xl font-semibold text-yellow-600">
                  Payment Pending
                </h2>
                <p className="text-muted-foreground">
                  Your payment is being processed. Please check back later.
                </p>
                {paymentData && (
                  <div className="bg-muted p-4 rounded-lg space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="font-medium">Order Number:</span>
                      <span className="text-muted-foreground">
                        {paymentData.orderNumber}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Status:</span>
                      <span className="text-yellow-600 font-semibold">
                        {paymentData.status}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex gap-4 justify-center mt-4">
                  <Button onClick={() => router.push("/orders")}>
                    View Orders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/products")}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            )}

            {status === "error" && (
              <div className="text-center space-y-4">
                <XCircle className="h-16 w-16 mx-auto text-destructive" />
                <h2 className="text-xl font-semibold text-destructive">
                  Verification Error
                </h2>
                <p className="text-muted-foreground">
                  We couldn&apos;t verify your payment. Please contact support
                  if you were charged.
                </p>
                <div className="flex gap-4 justify-center mt-4">
                  <Button onClick={() => router.push("/orders")}>
                    View Orders
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => router.push("/checkout")}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
