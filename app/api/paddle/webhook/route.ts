import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { processCompletedTransaction, processRefundedTransaction } from "@/lib/paddle-process";

function verifySignature(rawBody: string, signatureHeader: string | null, secret: string) {
  if (!signatureHeader) return false;
  const parts = Object.fromEntries(
    signatureHeader.split(";").map((kv) => kv.split("=") as [string, string])
  );
  if (!parts.ts || !parts.h1) return false;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${parts.ts}:${rawBody}`)
    .digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.h1));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "PADDLE_WEBHOOK_SECRET is not configured" }, { status: 500 });
  }

  const rawBody = await request.text();
  if (!verifySignature(rawBody, request.headers.get("paddle-signature"), secret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const event = JSON.parse(rawBody);

  if (["transaction.completed", "transaction.paid"].includes(event.event_type)) {
    try {
      await processCompletedTransaction(event.data);
    } catch (error) {
      console.error("Paddle webhook processing failed:", error);
      // 500 makes Paddle retry the webhook later
      return NextResponse.json({ error: "Processing failed" }, { status: 500 });
    }
  }

  // Full refunds and chargebacks revoke everything the purchase granted.
  // Partial adjustments (e.g. tax corrections) don't touch entitlements.
  if (["adjustment.created", "adjustment.updated"].includes(event.event_type)) {
    const adjustment = event.data;
    const revokes =
      ["refund", "chargeback"].includes(adjustment?.action) &&
      adjustment?.status === "approved" &&
      adjustment?.type !== "partial" &&
      typeof adjustment?.transaction_id === "string";
    if (revokes) {
      try {
        await processRefundedTransaction(adjustment.transaction_id);
      } catch (error) {
        console.error("Paddle refund processing failed:", error);
        return NextResponse.json({ error: "Processing failed" }, { status: 500 });
      }
    }
  }

  return NextResponse.json({ received: true });
}
