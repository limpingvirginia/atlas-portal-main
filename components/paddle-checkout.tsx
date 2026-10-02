"use client";

import React, { useEffect, useState, useCallback, useRef, useId, useMemo } from "react";
import usePaddle from "@/hooks/use-paddle";
import { Product, products } from "@/lib/products";
import { cn } from "@/lib/utils";
import axios from "axios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useCheckoutDialogStore } from "@/store/checkout-dialog-store";
import { useSession } from "@/lib/auth-client";

type PaddleCheckoutType = {
  children: React.ReactNode;
  product_key?: string;
  className?: string;
};

export default function PaddleCheckout({ children, className, product_key }: PaddleCheckoutType) {
  const paddle = usePaddle();
  const { data: session } = useSession();
  const [selectProduct, setSelectProduct] = useState<Product | null>(null);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const { openProductId, setOpenProductId } = useCheckoutDialogStore();
  const openingRef = useRef(false);
  const isSignedIn = !!session?.user;

  // Several buttons for the same product can exist on one page — each
  // PaddleCheckout instance gets its own dialog identity and frame target so
  // only the clicked one opens and Paddle mounts into the right dialog.
  const reactId = useId();
  const instanceId = useMemo(() => reactId.replace(/[^a-zA-Z0-9]/g, ""), [reactId]);
  const frameTarget = `paddle-checkout-frame-${instanceId}`;

  const isOpen = !!selectProduct && openProductId === instanceId;

  useEffect(() => {
    if (product_key) {
      const product = products.find((item) => item.id === product_key);
      setSelectProduct(product || null);
    }
  }, [product_key]);

  const openCheckout = useCallback(async () => {
    if (!selectProduct || !paddle || openingRef.current) return;

    openingRef.current = true;
    try {
      // The price is defined app-side: the server creates a Paddle transaction
      // with an inline price and the checkout renders inside our dialog.
      const { data } = await axios.post("/api/paddle/transaction", {
        product_id: selectProduct.id
      });

      if (!data?.transactionId) {
        console.error("No transactionId returned from /api/paddle/transaction");
        return;
      }

      setTransactionId(data.transactionId);
      setOpenProductId(instanceId);
    } catch (error) {
      console.error("Failed to start Paddle checkout:", error);
    } finally {
      openingRef.current = false;
    }
  }, [selectProduct, paddle, setOpenProductId, instanceId]);

  // Mount the inline checkout after the dialog (and the frame target div) is in the DOM
  useEffect(() => {
    if (!isOpen || !paddle || !transactionId) return;

    const frame = requestAnimationFrame(() => {
      paddle.Checkout.open({
        settings: {
          displayMode: "inline",
          variant: "one-page",
          frameTarget,
          frameInitialHeight: 450,
          frameStyle: "width: 100%; min-width: 286px; background-color: transparent; border: none;",
          // Signed-in users checkout with their account email: the transaction
          // already carries their Paddle customer, so lock the email field
          allowLogout: !isSignedIn
        },
        transactionId
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [isOpen, paddle, transactionId, isSignedIn, frameTarget]);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      paddle?.Checkout.close();
      setOpenProductId(null);
      setTransactionId(null);
    }
  };

  return (
    <>
      <div className={cn("inline", className)} onClick={openCheckout}>
        {children}
      </div>

      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)] sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectProduct?.title}</DialogTitle>
          </DialogHeader>
          {/* Scrolls internally when the form is taller than the viewport */}
          <div className={cn(frameTarget, "min-h-[min(450px,60dvh)] overflow-y-auto")} />
        </DialogContent>
      </Dialog>
    </>
  );
}
