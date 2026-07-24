/**
 * Server functions for standalone PayPal checkout.
 * Called from client components with `createServerFn`.
 */
import { createServerFn } from "@tanstack/react-start";

const PAYPAL_BASE =
  process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";

async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !secret) throw new Error("PayPal credentials not configured");

  const auth = Buffer.from(`${clientId}:${secret}`).toString("base64");
  const res = await fetch(`${PAYPAL_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!res.ok) throw new Error(`PayPal auth failed: ${res.status}`);
  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

// ─── Plans ──────────────────────────────────────────────────────────────────

const PLANS: Record<
  string,
  { name: string; price: string; interval: "MONTH" | "YEAR"; id: string }
> = {
  monthly: {
    name: "CorbaTales Monthly",
    price: "12.99",
    interval: "MONTH",
    id: process.env.PAYPAL_PLAN_MONTHLY || "",
  },
  annual: {
    name: "CorbaTales Annual",
    price: "99.99",
    interval: "YEAR",
    id: process.env.PAYPAL_PLAN_ANNUAL || "",
  },
};

// ─── Create Order ───────────────────────────────────────────────────────────

export const createPayPalOrder = createServerFn({ method: "POST" })
  .validator((data: { plan: "monthly" | "annual"; userId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const token = await getPayPalAccessToken();
      const plan = PLANS[data.plan];

      const body = {
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: plan.price,
            },
            description: plan.name,
            custom_id: data.userId,
          },
        ],
        application_context: {
          brand_name: "CorbaTales",
          landing_page: "LOGIN",
          user_action: "SUBSCRIBE_NOW",
          return_url: `${process.env.BASE_URL || ""}/dashboard?paypal=success`,
          cancel_url: `${process.env.BASE_URL || ""}/pricing?paypal=canceled`,
        },
      };

      const res = await fetch(`${PAYPAL_BASE}/v2/checkout/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const err = await res.text();
        console.error("PayPal order creation failed:", err);
        return { error: "Failed to create PayPal order" };
      }

      const order = (await res.json()) as { id: string; links: Array<{ rel: string; href: string }> };
      const approveUrl = order.links?.find((l) => l.rel === "approve")?.href;

      return { orderId: order.id, approveUrl };
    } catch (error) {
      console.error("PayPal order error:", error);
      return { error: "Failed to create PayPal order" };
    }
  });

// ─── Capture Order ──────────────────────────────────────────────────────────

export const capturePayPalOrder = createServerFn({ method: "POST" })
  .validator((data: { orderId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const token = await getPayPalAccessToken();
      const res = await fetch(
        `${PAYPAL_BASE}/v2/checkout/orders/${data.orderId}/capture`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        const err = await res.text();
        console.error("PayPal capture failed:", err);
        return { error: "Failed to capture PayPal order" };
      }

      const capture = await res.json();
      return { success: true, capture };
    } catch (error) {
      console.error("PayPal capture error:", error);
      return { error: "Failed to capture PayPal order" };
    }
  });
