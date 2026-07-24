/**
 * PayPal Checkout Button — Standalone PayPal integration.
 * Drop this alongside the Stripe button to give users a choice.
 *
 * Usage: <PayPalButton plan="monthly" userId={user.id} />
 */
import { useState } from "react";
import { createPayPalOrder } from "~/lib/paypal-server";

interface PayPalButtonProps {
  plan: "monthly" | "annual";
  userId: string;
  label?: string;
  className?: string;
}

export function PayPalButton({
  plan,
  userId,
  label = `Pay with PayPal${plan === "annual" ? " — Save 35%" : ""}`,
  className = "",
}: PayPalButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePayPal = async () => {
    setLoading(true);
    try {
      const result = await createPayPalOrder({
        data: { plan, userId },
      });

      if (result.error) {
        alert("PayPal is not configured yet. Please try card payment.");
        return;
      }

      if (result.approveUrl) {
        window.location.href = result.approveUrl;
      }
    } catch (err) {
      console.error("PayPal error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handlePayPal}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-[#0070BA] px-6 py-3 text-sm font-ui font-semibold text-white transition-all hover:bg-[#005EA6] disabled:opacity-50 ${className}`}
    >
      {loading ? (
        <span>Redirecting to PayPal…</span>
      ) : (
        <>
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797H8.745c-.546 0-1.01.398-1.097.94l-.597 3.8-.166 1.073a.641.641 0 0 1-.633.54h.001z"/>
          </svg>
          {label}
        </>
      )}
    </button>
  );
}
