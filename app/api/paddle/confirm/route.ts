import { NextResponse } from "next/server";
import { PADDLE_API_BASE, paddleEnv, processCompletedTransaction } from "@/lib/paddle-process";

/**
 * Processes a purchase right after the checkout completes on the client.
 * The client only sends a transaction id — the transaction itself is fetched
 * and verified from the Paddle API, so this cannot be used to forge purchases.
 * The webhook stays as the safety net; processing is idempotent.
 */
export async function POST(request: Request) {
  const { transaction_id } = await request.json();

  if (typeof transaction_id !== "string" || !transaction_id.startsWith("txn_")) {
    return NextResponse.json({ error: "Invalid transaction id" }, { status: 400 });
  }

  // Right after checkout.completed the Paddle API may still report the
  // transaction as ready/billed for a few seconds — poll until it is paid.
  let transaction: (Parameters<typeof processCompletedTransaction>[0] & { status?: string }) | null =
    null;
  for (let attempt = 0; attempt < 6; attempt++) {
    if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, 2000));

    const res = await fetch(`${PADDLE_API_BASE[paddleEnv()]}/transactions/${transaction_id}`, {
      headers: { Authorization: `Bearer ${process.env.PADDLE_API_KEY}` },
      cache: "no-store"
    });
    if (!res.ok) continue;

    const candidate = (await res.json())?.data;
    if (["completed", "paid"].includes(candidate?.status)) {
      transaction = candidate;
      break;
    }
  }

  if (!transaction) {
    return NextResponse.json({ error: "Transaction is not paid" }, { status: 400 });
  }

  try {
    const result = await processCompletedTransaction(transaction);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Paddle confirm processing failed:", error);
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
