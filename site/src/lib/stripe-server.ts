/**
 * Server functions for Stripe checkout and subscription management.
 * Called from client components with `createServerFn`.
 */
import { createServerFn } from "@tanstack/react-start";
import { getStripeServer, STRIPE_PRICE_MONTHLY, STRIPE_PRICE_ANNUAL } from "~/lib/stripe";

export const createCheckoutSession = createServerFn({ method: "POST" })
  .validator((data: { plan: "monthly" | "annual"; userId: string; email: string }) => data)
  .handler(async ({ data }) => {
    try {
      const stripe = getStripeServer();
      const priceId = data.plan === "annual" ? STRIPE_PRICE_ANNUAL : STRIPE_PRICE_MONTHLY;

      if (!priceId) {
        return { error: "No price ID configured. Set STRIPE_PRICE_MONTHLY or STRIPE_PRICE_ANNUAL." };
      }

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${process.env.BASE_URL || "https://4497395f80d7bf602e6505d07bcfa780.ctonew.app"}/dashboard?checkout=success`,
        cancel_url: `${process.env.BASE_URL || "https://4497395f80d7bf602e6505d07bcfa780.ctonew.app"}/pricing?checkout=canceled`,
        customer_email: data.email,
        client_reference_id: data.userId,
        metadata: { userId: data.userId },
      });

      return { url: session.url };
    } catch (error) {
      console.error("Stripe checkout error:", error);
      return { error: "Failed to create checkout session" };
    }
  });