/**
 * Stripe configuration.
 * 
 * These env vars are needed:
 *   STRIPE_SECRET_KEY        - from Stripe dashboard
 *   STRIPE_PUBLISHABLE_KEY   - from Stripe dashboard (public key)
 *   STRIPE_WEBHOOK_SECRET    - from Stripe dashboard webhooks
 * 
 * The following price IDs correspond to the products in Stripe:
 *   STRIPE_PRICE_MONTHLY     - $12.99/mo price ID
 *   STRIPE_PRICE_ANNUAL      - $99.99/yr price ID
 */

import Stripe from "stripe";

export const getStripeServer = () => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set — configure Stripe before using payments.");
  }
  return new Stripe(key, { apiVersion: "2025-03-31.basil" as any });
};

export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || "";
export const STRIPE_PRICE_MONTHLY = process.env.STRIPE_PRICE_MONTHLY || "";
export const STRIPE_PRICE_ANNUAL = process.env.STRIPE_PRICE_ANNUAL || "";
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || "";

export const PLAN_PRICES = {
  monthly: { usd: 12.99, stripePriceId: STRIPE_PRICE_MONTHLY },
  annual: { usd: 99.99, stripePriceId: STRIPE_PRICE_ANNUAL },
  gift: { usd: 12.99, stripePriceId: "" },
} as const;
