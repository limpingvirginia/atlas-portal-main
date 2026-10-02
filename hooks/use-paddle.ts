"use client";

import { initializePaddle, InitializePaddleOptions, Paddle } from "@paddle/paddle-js";
import { useEffect, useRef, useState } from "react";
import { useThanksDialogStore } from "@/store/thanks-dialog-store";
import { useCheckoutDialogStore } from "@/store/checkout-dialog-store";

type PaddleEventName = "checkout.loaded" | "checkout.completed";

export default function usePaddle() {
  const [paddle, setPaddle] = useState<Paddle | null>(null);
  const paddleRef = useRef<Paddle | null>(null);

  // Purchase processing (recording the sale, emails, teams) happens server-side:
  // the confirm endpoint verifies the transaction against the Paddle API right
  // after checkout, and the webhook remains as the safety net. Both are idempotent.
  const handlePaddleEvent = ({
    name,
    data
  }: {
    name: PaddleEventName;
    data?: { transaction_id?: string };
  }) => {
    if (name === "checkout.completed") {
      paddleRef.current?.Checkout.close();
      // close the checkout dialog that hosts the inline frame
      useCheckoutDialogStore.getState().setOpenProductId(null);
      // thanks dialog
      useThanksDialogStore.getState().toggleOpen();

      if (data?.transaction_id) {
        fetch("/api/paddle/confirm", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transaction_id: data.transaction_id })
        }).catch((error) => console.error("Failed to confirm transaction:", error));
      }
    }
  };

  useEffect(() => {
    const environment = process.env.NEXT_PUBLIC_PADDLE_ENV;
    const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;

    if (!environment || !token) {
      console.error("Paddle environment or token is missing");
      return;
    }

    initializePaddle({
      environment,
      token,
      eventCallback: handlePaddleEvent
    } as InitializePaddleOptions)
      .then((paddleInstance) => {
        if (paddleInstance) {
          paddleRef.current = paddleInstance;
          setPaddle(paddleInstance);
        }
      })
      .catch((err) => {
        console.error("Error initializing Paddle:", err);
      });
  }, []);

  return paddle;
}
