import { CheckoutForm } from "./_components/checkout-form";
import { getCart } from "@/lib/network/api/cart";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/network/api/auth";

export default async function CheckoutPage() {
  const authenticated = await isAuthenticated();
  
  if (!authenticated) {
    redirect("/login");
  }

  const cartData = await getCart();
  
  if (!cartData || cartData.items.length === 0) {
    redirect("/cart");
  }

  return <CheckoutForm cart={cartData.items} cartTotal={cartData.total} />;
}
