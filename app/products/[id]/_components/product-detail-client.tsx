"use client";

// 1. FIX: Import useTransition
import { useActionState, useState, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star,
  Minus,
  Plus,
  ShoppingCart,
  ArrowLeft,
  Check,
} from "lucide-react";
import { addToCartAction } from "@/lib/actions/cart";
import type { Product } from "@/lib/types/main";
import { getImageUrl } from "@/lib/utils/image";

const initialState = {
  success: false,
  errors: {} as Record<string, string[]>,
};

interface ProductDetailClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [state, formAction] = useActionState(addToCartAction, initialState);
  const [selectedImage, setSelectedImage] = useState(product.mainImage);

  // 2. FIX: Initialize useTransition
  const [isPending, startTransition] = useTransition();

  // 3. FIX: Watch state changes for success/error
  useEffect(() => {
    if (state.success) {
      setAdded(true);
      toast.success("Added to cart", {
        description: `${product.name} has been added to your cart.`,
      });
      setTimeout(() => setAdded(false), 2000);
    } else if (state.errors?.userId) {
      toast.error("Authentication required", {
        description: "Please log in to add items to your cart.",
        action: {
          label: "Login",
          onClick: () => router.push("/login"),
        }
      });
    } else if (state.errors?.general) {
      toast.error("Error", {
        description: state.errors.general[0]
      });
    }
  }, [state, product.name, router]);

  // 4. FIX: simple wrapper around formAction
  const handleAddToCart = async () => {
    const formData = new FormData();
    formData.append("productId", product.id.toString());
    formData.append("quantity", quantity.toString());

    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="ghost"
        size="sm"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-xl bg-muted">
            <Image
              src={getImageUrl(selectedImage)}
              alt={product.name}
              fill
              className="object-cover"
            />
            {product.stockQuantity < 10 && product.stockQuantity > 0 && (
              <Badge className="absolute left-4 top-4 bg-accent text-accent-foreground">
                Only {product.stockQuantity} left
              </Badge>
            )}
            {product.stockQuantity === 0 && (
              <Badge className="absolute left-4 top-4" variant="destructive">
                Out of Stock
              </Badge>
            )}
          </div>
          <div className="mt-4 grid grid-cols-5 gap-4">
            <div
              className={`relative aspect-square cursor-pointer overflow-hidden rounded-md ${selectedImage === product.mainImage ? "ring-2 ring-primary" : ""}`}
              onClick={() => setSelectedImage(product.mainImage)}
            >
              <Image
                src={getImageUrl(product.mainImage)}
                alt="Main product image"
                fill
                className="object-cover"
              />
            </div>
            {product.secondaryImages?.map((image, index) => (
              <div
                key={index}
                className={`relative aspect-square cursor-pointer overflow-hidden rounded-md ${selectedImage === image ? "ring-2 ring-primary" : ""}`}
                onClick={() => setSelectedImage(image)}
              >
                <Image
                  src={getImageUrl(image)}
                  alt={`Secondary product image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <div>
            <p className="text-sm text-muted-foreground">{product.category}</p>
            <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>

            <div className="mt-4 flex items-center gap-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating || 0)
                      ? "fill-chart-3 text-chart-3"
                      : "fill-muted text-muted"
                      }`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                ({product.rating || 0} rating)
              </span>
            </div>

            <p className="mt-6 text-4xl font-bold">
              ${product.price.toFixed(2)}
            </p>

            <p className="mt-6 leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center rounded-lg border">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setQuantity((q) => Math.min(product.stockQuantity, q + 1))
                  }
                  disabled={quantity >= product.stockQuantity}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                // 4. FIX (Recommended): Use isPending for visual state
                disabled={product.stockQuantity === 0 || added || isPending}
              >
                {isPending ? (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5 animate-spin" />
                    Adding...
                  </>
                ) : added ? (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>

            <p className="text-sm text-muted-foreground">
              {product.stockQuantity > 0
                ? `${product.stockQuantity} items in stock`
                : "Currently unavailable"}
            </p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-2xl font-bold">Related Products</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <Link key={p.id} href={`/products/${p.id}`} className="group">
                <div className="overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg">
                  <div className="relative aspect-square bg-muted">
                    <Image
                      src={getImageUrl(p.mainImage)}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-1">{p.name}</h3>
                    <p className="mt-1 font-bold">${p.price.toFixed(2)}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}