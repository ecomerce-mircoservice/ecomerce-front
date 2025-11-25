import { getCart } from "@/lib/network/api/cart";
import { isAuthenticated } from "@/lib/network/api/auth";
import { CartPageClient } from "./_components/cart-page-client";
import { CartResponse } from "@/lib/types/main";

export default async function CartPage() {
  const authenticated = await isAuthenticated();
  const cartData = authenticated ? await getCart() : { items: [], total: 0, itemCount: 0 };

  return <CartPageClient cart={cartData as CartResponse} isAuthenticated={authenticated} />;
}
