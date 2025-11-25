import { HomePage } from "./_components/home-page";
import { getFeaturedProducts } from "@/lib/network/api/products";

export default async function Home() {
  const featuredProducts = await getFeaturedProducts(8);
  
  return <HomePage featuredProducts={featuredProducts} />;
}
