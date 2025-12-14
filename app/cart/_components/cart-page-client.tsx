"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { updateCartItemAction, removeFromCartAction } from "@/lib/actions/cart";
import type { CartResponse } from "@/lib/types/main";
import { getImageUrl } from "@/lib/utils/image";
import { useActionState, useTransition, useEffect } from "react";
import { toast } from "sonner";

const initialState = {
  success: false,
  errors: {} as Record<string, string[]>,
};

interface CartPageClientProps {
  cart: CartResponse;
  isAuthenticated: boolean;
}

export function CartPageClient({ cart, isAuthenticated }: CartPageClientProps) {
  const [updateState, updateAction] = useActionState(updateCartItemAction, initialState);
  const [removeState, removeAction] = useActionState(removeFromCartAction, initialState);
  const [isPending, startTransition] = useTransition();

  // Show toast notifications based on action results
  useEffect(() => {
    if (updateState.success) {
      toast.success("Cart updated");
    } else if (updateState.errors?.general) {
      toast.error(updateState.errors.general[0]);
    }
  }, [updateState]);

  useEffect(() => {
    if (removeState.success) {
      toast.success("Item removed from cart");
    } else if (removeState.errors?.general) {
      toast.error(removeState.errors.general[0]);
    }
  }, [removeState]);

  const handleUpdateQuantity = async (productId: number, quantity: number) => {
    const formData = new FormData();
    formData.append("productId", productId.toString());
    formData.append("quantity", quantity.toString());
    startTransition(() => {
      updateAction(formData);
    });
  };

  const handleRemove = async (productId: number) => {
    const formData = new FormData();
    formData.append("productId", productId.toString());
    startTransition(() => {
      removeAction(formData);
    });
  };

  if (!cart?.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        <div className="rounded-full bg-muted p-6">
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">
          Add some products to get started!
        </p>
        <Link href="/products">
          <Button className="mt-6">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const cartTotal = cart.total;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <p className="mt-2 text-muted-foreground">
        {cart.items.length} item{cart.items.length !== 1 && "s"} in your cart
      </p>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <Card key={item.product.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={getImageUrl(item.product.mainImage)}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between">
                      <div>
                        <Link
                          href={`/products/${item.product.id}`}
                          className="font-semibold hover:underline"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {item.product.category}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-muted-foreground hover:text-destructive"
                        onClick={() => handleRemove(item.product.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-lg border">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">
                          {item.quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleUpdateQuantity(
                              item.product.id,
                              item.quantity + 1
                            )
                          }
                          disabled={item.quantity >= item.product.stockQuantity}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>
                    $
                    {(
                      cartTotal +
                      (cartTotal >= 50 ? 0 : 9.99) +
                      cartTotal * 0.08
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              {isAuthenticated ? (
                <Link href="/checkout" className="w-full">
                  <Button className="w-full gap-2">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link href="/login" className="w-full">
                  <Button className="w-full">Login to Checkout</Button>
                </Link>
              )}
              <Link href="/products" className="w-full">
                <Button variant="outline" className="w-full bg-transparent">
                  Continue Shopping
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
