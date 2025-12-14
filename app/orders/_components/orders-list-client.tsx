"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, ArrowRight, ShoppingBag } from "lucide-react";
import type { Order } from "@/lib/types/main";

const statusColors = {
  pending: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  processing: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  shipped: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  delivered: "bg-green-500/10 text-green-600 border-green-500/20",
  cancelled: "bg-red-500/10 text-red-600 border-red-500/20",
};

interface OrdersListClientProps {
  orders: Order[];
}

export function OrdersListClient({ orders }: OrdersListClientProps) {
  if (orders.length === 0) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16">
        <div className="rounded-full bg-muted p-6">
          <Package className="h-12 w-12 text-muted-foreground" />
        </div>
        <h1 className="mt-6 text-2xl font-bold">No orders yet</h1>
        <p className="mt-2 text-muted-foreground">
          Start shopping to see your orders here!
        </p>
        <Link href="/products">
          <Button className="mt-6 gap-2">
            <ShoppingBag className="h-4 w-4" />
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">My Orders</h1>
      <p className="mt-2 text-muted-foreground">
        {orders.length} order{orders.length !== 1 && "s"}
      </p>

      <div className="mt-8 space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg font-mono">
                  {order.orderNumber}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <Badge
                variant="outline"
                className={
                  statusColors[
                  order.status.toLowerCase() as keyof typeof statusColors
                  ] || statusColors.pending
                }
              >
                {order.status}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {order.orderItems?.length || 0} item
                    {(order.orderItems?.length || 0) !== 1 && "s"}
                  </p>
                  <p className="mt-1 font-semibold">
                    ${order.totalAmount.toFixed(2)}
                  </p>
                </div>
                <Link href={`/orders/${order.orderNumber}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 bg-transparent"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
