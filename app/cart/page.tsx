import { HeaderWrapper } from "@/components/header-wrapper";
import { getCurrentUser } from "@/lib/network/api/auth";
import { getCart } from "@/lib/network/api/cart";
import { CartPageClient } from "./_components/cart-page-client";
import { CartResponse } from "@/lib/types/main";

export default async function CartPage() {
  const currentUser = await getCurrentUser();
  console.log("[CartPage] Current User from /me:", currentUser);
  const authenticated = !!currentUser;

  const cartData = authenticated
    ? await getCart(currentUser.id)
    : { items: [], total: 0, itemCount: 0 };

  if (authenticated) {
    console.log("[CartPage] Fetching cart for ID:", currentUser.id);
  }
  console.log("[CartPage] Retrieved Cart Data:", cartData);

  return (
    <div className="min-h-screen">
      <HeaderWrapper />
      <CartPageClient
        cart={cartData as CartResponse}
        isAuthenticated={authenticated}
      />
    </div>
  );
}
