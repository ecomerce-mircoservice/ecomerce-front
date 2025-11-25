import { getAllOrders } from "@/lib/network/api/orders";
import { isAuthenticated } from "@/lib/network/api/auth";
import { redirect } from "next/navigation";
import { OrdersListClient } from "./_components/orders-list-client";

export default async function OrdersPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect("/login");
  }

  const orders = await getAllOrders();

  return <OrdersListClient orders={orders} />;
}
