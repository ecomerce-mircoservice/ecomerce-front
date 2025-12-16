import { HeaderWrapper } from "@/components/header-wrapper";
import { getCurrentUser } from "@/lib/network/api/auth";
import { getCart } from "@/lib/network/api/cart";
import { CheckoutForm } from "./_components/checkout-form";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  if (!user) {
    return null;
  }

  const cartData = await getCart(user.id);

  return (
    <div className="min-h-screen">
      <HeaderWrapper />
      <CheckoutForm cart={cartData.items} cartTotal={cartData.total} />
    </div>
  );
}
