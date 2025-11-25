"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types/main"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Star, ShoppingCart } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore()

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {product.stock < 10 && product.stock > 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-accent px-2 py-1 text-xs font-medium text-accent-foreground">
              Low Stock
            </span>
          )}
          {product.stock === 0 && (
            <span className="absolute left-2 top-2 rounded-full bg-destructive px-2 py-1 text-xs font-medium text-destructive-foreground">
              Out of Stock
            </span>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/products/${product.id}`}>
          <p className="text-xs text-muted-foreground">{product.category}</p>
          <h3 className="mt-1 font-semibold line-clamp-1 group-hover:text-primary">{product.name}</h3>
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-4 w-4 fill-chart-3 text-chart-3" />
            <span className="text-sm text-muted-foreground">{product.rating}</span>
          </div>
        </Link>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
        <Button size="sm" onClick={() => addToCart(product)} disabled={product.stock === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  )
}
