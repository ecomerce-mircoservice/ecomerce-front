import { getAllProducts } from "@/lib/network/api/products";
import { ProductsListClient } from "./_components/products-list-client";


export default async function ProductsPage() {
  const products = await getAllProducts();
  const categories = ["All", "Electronics", "Clothing", "Accessories", "Home", "Sports", "Shoes"];
  
  return <ProductsListClient products={products} categories={categories} />;
}
