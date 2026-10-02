import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { products, TEAM_PRODUCT_IDS } from "@/lib/products";

const PADDLE_API_BASE = {
  production: "https://api.paddle.com",
  sandbox: "https://sandbox-api.paddle.com"
};

/** Find or create the Paddle customer for a signed-in user so the purchase links to their account. */
async function resolveCustomerId(base: string, apiKey: string, email: string) {
  const headersInit = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };

  const createRes = await fetch(`${base}/customers`, {
    method: "POST",
    headers: headersInit,
    body: JSON.stringify({ email })
  });
  if (createRes.ok) {
    return (await createRes.json())?.data?.id ?? null;
  }

  // 409: customer already exists — look it up by email
  const searchRes = await fetch(`${base}/customers?email=${encodeURIComponent(email)}`, {
    headers: headersInit
  });
  if (!searchRes.ok) return null;
  return (await searchRes.json())?.data?.[0]?.id ?? null;
}

export async function POST(request: Request) {
  const { product_id } = await request.json();

  const product = products.find((p) => p.id === product_id);
  if (!product) {
    return NextResponse.json({ error: "Unknown product" }, { status: 404 });
  }

  const env = process.env.NEXT_PUBLIC_PADDLE_ENV === "production" ? "production" : "sandbox";
  const apiKey = process.env.PADDLE_API_KEY;
  const paddleProductId = product.paddle_product_id[env];

  if (!apiKey) {
    return NextResponse.json({ error: "PADDLE_API_KEY is not configured" }, { status: 500 });
  }
  if (!paddleProductId) {
    return NextResponse.json(
      { error: `Product has no Paddle product id for the "${env}" environment` },
      { status: 500 }
    );
  }

  // If the user is signed in, attach their Paddle customer so the purchase
  // links to their account and the checkout email comes prefilled.
  const session = await auth.api.getSession({ headers: await headers() });

  // The upgrade product is the price difference between Pro and Premium —
  // only owners of a completed starter purchase (without a team) can buy it
  if (product.id === "nextjs-upgrade") {
    if (!session?.user) {
      return NextResponse.json({ error: "Sign in to upgrade your license" }, { status: 401 });
    }
    const owned = await db.query(
      `select product_id, status from purchases where user_id = $1`,
      [session.user.id]
    );
    const hasStarter = owned.rows.some(
      (row) => row.product_id === "nextjs-starter" && row.status === "completed"
    );
    const hasTeam = owned.rows.some(
      (row) => TEAM_PRODUCT_IDS.includes(row.product_id) && row.status === "completed"
    );
    if (!hasStarter || hasTeam) {
      return NextResponse.json(
        { error: "Upgrade is only available for Pro license owners" },
        { status: 403 }
      );
    }
  }
  const customerId = session?.user?.email
    ? await resolveCustomerId(PADDLE_API_BASE[env], apiKey, session.user.email)
    : null;

  // Price is defined here in the app and sent to Paddle as a non-catalog (inline) price.
  const response = await fetch(`${PADDLE_API_BASE[env]}/transactions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      ...(customerId ? { customer_id: customerId } : {}),
      items: [
        {
          quantity: 1,
          price: {
            name: product.title,
            description: product.full_name ?? product.title ?? product.id,
            product_id: paddleProductId,
            unit_price: {
              amount: product.unit_amount,
              currency_code: product.currency_code
            },
            tax_mode: "account_setting",
            quantity: { minimum: 1, maximum: 1 }
          }
        }
      ],
      custom_data: {
        app_product_id: product.id,
        // Ties the purchase to the signed-in account even if the customer
        // pays with a different email in the checkout
        ...(session?.user?.id ? { app_user_id: session.user.id } : {})
      }
    })
  });

  const json = await response.json();

  if (!response.ok) {
    console.error("Paddle transaction error:", JSON.stringify(json?.error ?? json));
    return NextResponse.json(
      { error: json?.error?.detail ?? "Failed to create Paddle transaction" },
      { status: response.status }
    );
  }

  return NextResponse.json({ transactionId: json.data.id });
}
