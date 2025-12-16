"use client";

import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function PaymentCancelPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">
              Payment Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <XCircle className="h-16 w-16 mx-auto text-yellow-500" />
              <h2 className="text-xl font-semibold">Payment Cancelled</h2>
              <p className="text-muted-foreground">
                You cancelled the payment process.
              </p>
              <p className="text-muted-foreground">
                No charges were made to your account.
              </p>

              <div className="flex gap-4 justify-center mt-6">
                <Button onClick={() => router.push("/cart")}>
                  Return to Cart
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/checkout")}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
