"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createOrderAndCheckoutAction } from "@/lib/actions/payments";
import type { CartItem } from "@/lib/types/main";
import { getImageUrl } from "@/lib/utils/image";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { useActionState, useEffect } from "react";
import { toast } from "sonner";

const initialState = {
  success: false,
  errors: {} as Record<string, string[]>,
};

interface CheckoutFormProps {
  cart: CartItem[];
  cartTotal: number;
}

export function CheckoutForm({ cart, cartTotal }: CheckoutFormProps) {
  const [state, formAction, isPending] = useActionState(
    createOrderAndCheckoutAction,
    initialState
  );

  useEffect(() => {
    // Handle successful checkout - redirect to Stripe
    if (state.success && (state as any).checkoutUrl) {
      console.log("Redirecting to Stripe:", (state as any).checkoutUrl);
      window.location.href = (state as any).checkoutUrl;
    }

    // Show error messages
    if (state.errors?.general) {
      toast.error("Failed to create checkout session", {
        description: state.errors.general[0],
        duration: 5000,
      });
    }
  }, [state.success, state.errors]);

  const total = cartTotal + (cartTotal >= 50 ? 0 : 9.99) + cartTotal * 0.08;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Checkout</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Shipping Form */}
        <div className="lg:col-span-2">
          <form action={formAction}>
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    required
                    disabled={isPending}
                  />
                  {state.errors?.fullName && (
                    <p className="text-sm text-destructive">
                      {state.errors.fullName[0]}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Street Address</Label>
                  <Input
                    id="street"
                    name="street"
                    required
                    disabled={isPending}
                  />
                  {state.errors?.street && (
                    <p className="text-sm text-destructive">
                      {state.errors.street[0]}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      required
                      disabled={isPending}
                    />
                    {state.errors?.city && (
                      <p className="text-sm text-destructive">
                        {state.errors.city[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      required
                      disabled={isPending}
                    />
                    {state.errors?.state && (
                      <p className="text-sm text-destructive">
                        {state.errors.state[0]}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      required
                      disabled={isPending}
                    />
                    {state.errors?.zipCode && (
                      <p className="text-sm text-destructive">
                        {state.errors.zipCode[0]}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      name="country"
                      required
                      disabled={isPending}
                    />
                    {state.errors?.country && (
                      <p className="text-sm text-destructive">
                        {state.errors.country[0]}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertTitle>Secure Payment with Stripe</AlertTitle>
                  <AlertDescription>
                    You will be redirected to Stripe&apos;s secure checkout page
                    to complete your payment. Click &quot;Proceed to
                    Payment&quot; to continue.
                  </AlertDescription>
                </Alert>
              </CardContent>
              <CardFooter>
                <Button
                  type="submit"
                  className="w-full"
                  size="lg"
                  disabled={isPending}
                >
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {isPending
                    ? "Processing..."
                    : `Proceed to Payment - $${total.toFixed(2)}`}
                </Button>
              </CardFooter>
            </Card>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={getImageUrl(item.product.mainImage)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium line-clamp-1">
                      {item.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-medium">
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{cartTotal >= 50 ? "Free" : "$9.99"}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax</span>
                  <span>${(cartTotal * 0.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
