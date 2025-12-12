"use client";

import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types/main";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { getImageUrl } from "@/lib/utils/image";

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    } else {
      // FIX: Redirect to product details instead of fake add
      window.location.href = `/products/${product.id}`;
    }
  };

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={getImageUrl(product.mainImage)}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.stockQuantity < 10 && product.stockQuantity > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
              Low Stock
            </span>
          )}
          {product.stockQuantity === 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
              Out of Stock
            </span>
          )}
          {!product.active && (
            <span className="absolute left-2 top-2 rounded-full bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
              Inactive
            </span>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <p className="text-xs text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 font-semibold line-clamp-1 group-hover:text-primary">
            {product.name}
          </h3>
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-chart-3 text-chart-3" />
            <span className="text-sm text-muted-foreground">
              {product.rating || 0}
            </span>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        <Button
          size="sm"
          onClick={handleAddToCart}
          disabled={product.stockQuantity === 0 || !product.active}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
