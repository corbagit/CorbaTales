import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/pricing")({
  component: Pricing,
});

function Pricing() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-heading text-4xl font-bold text-cream sm:text-5xl">
            Simple, <span className="text-gradient">Magical</span> Pricing
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-lg font-body text-cream/60">
            Start with a free trial. No credit card required. Cancel anytime.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {/* Monthly */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10">
            <h3 className="text-lg font-heading font-semibold text-cream">Monthly</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-heading font-bold text-cream">$12.99</span>
              <span className="ml-1 font-body text-cream/50">/mo</span>
            </div>
            <p className="mt-2 text-sm font-body text-cream/50">30 fresh stories per month</p>
            <ul className="mt-8 space-y-4">
              {[
                "Brand-new story every night",
                "Voice narration included",
                "Original AI illustrations",
                "Unlimited story library access",
                "Replay any story forever",
                "Cancel anytime",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-body text-cream/70">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              className="mt-8 block w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-center text-sm font-ui font-semibold text-cream transition-all hover:bg-white/10"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Annual (featured) */}
          <div className="relative rounded-2xl border border-amber/30 bg-gradient-card p-8 glow">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-gradient-cta px-4 py-1 text-xs font-ui font-semibold text-midnight">
                Best Value
              </span>
            </div>
            <h3 className="text-lg font-heading font-semibold text-cream">Annual</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-heading font-bold text-cream">$99.99</span>
              <span className="ml-1 font-body text-cream/50">/yr</span>
            </div>
            <p className="mt-2 text-sm font-body">
              <span className="text-amber-400 font-semibold">Save 35%</span>{" "}
              <span className="text-cream/50">— just $8.33/mo</span>
            </p>
            <ul className="mt-8 space-y-4">
              {[
                "Everything in Monthly",
                "Bonus holiday story arcs",
                "Episodic story series",
                "Priority story quality",
                "Exclusive themed collections",
                "Best value for families",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-body text-cream/70">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              className="mt-8 block w-full rounded-xl bg-gradient-cta px-6 py-3.5 text-center text-sm font-ui font-semibold text-midnight transition-all hover:brightness-110"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Gift */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10">
            <h3 className="text-lg font-heading font-semibold text-cream">Gift Subscription</h3>
            <div className="mt-4 flex items-baseline">
              <span className="text-5xl font-heading font-bold text-cream">$12.99</span>
              <span className="ml-1 font-body text-cream/50">/mo</span>
            </div>
            <p className="mt-2 text-sm font-body text-cream/50">Or $99.99 for a full year</p>
            <ul className="mt-8 space-y-4">
              {[
                "Stories in your voice",
                "Perfect for grandparents",
                "Beautiful gift delivery",
                "No account needed to receive",
                "Share the magic with family",
                "Gift a year of bedtime stories",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm font-body text-cream/70">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-lavender-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link
              to="/signup"
              className="mt-8 block w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-center text-sm font-ui font-semibold text-cream transition-all hover:bg-white/10"
            >
              Gift Now
            </Link>
          </div>
        </div>

        {/* Physical keepsake */}
        <div className="mx-auto mt-16 max-w-2xl rounded-2xl border border-white/5 bg-white/[0.02] p-8 text-center">
          <div className="mb-4 text-4xl">📚</div>
          <h3 className="text-xl font-heading font-bold text-cream">Physical Keepsake Books</h3>
          <p className="mt-2 font-body text-cream/60">
            Select your child's 10 favorite stories from their library. We'll print them as a beautiful, 
            illustrated hardcover book and ship it to your door.
          </p>
          <p className="mt-4 text-2xl font-heading font-bold text-amber-400">
            $24.99 <span className="text-sm font-normal font-body text-cream/50">per book (+ Shipping &amp; Handling)</span>
          </p>
        </div>

        {/* Feature comparison */}
        <div className="mt-20">
          <h2 className="mb-8 text-center font-heading text-2xl font-bold text-cream">
            Everything Included
          </h2>
          <div className="overflow-hidden rounded-2xl border border-white/5">
            <table className="w-full text-left text-sm font-body">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  <th className="px-6 py-4 font-ui font-semibold text-cream">Feature</th>
                  <th className="px-6 py-4 text-center font-ui font-semibold text-amber-400">Monthly</th>
                  <th className="px-6 py-4 text-center font-ui font-semibold text-amber-300">Annual</th>
                  <th className="px-6 py-4 text-center font-ui font-semibold text-lavender-300">Gift</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  ["Daily new stories", "✓", "✓", "✓"],
                  ["Voice narration", "✓", "✓", "✓"],
                  ["Original illustrations", "✓", "✓", "✓"],
                  ["Unlimited library", "✓", "✓", "✓"],
                  ["Holiday story arcs", "—", "✓", "✓"],
                  ["Episodic series", "—", "✓", "✓"],
                  ["Priority quality", "—", "✓", "—"],
                  ["Gift delivery", "—", "—", "✓"],
                ].map(([feature, monthly, annual, gift]) => (
                  <tr key={feature} className="transition-colors hover:bg-white/[0.02]">
                    <td className="px-6 py-3.5 text-cream/70">{feature}</td>
                    <td className="px-6 py-3.5 text-center text-cream/50">{monthly}</td>
                    <td className="px-6 py-3.5 text-center text-cream/50">{annual}</td>
                    <td className="px-6 py-3.5 text-center text-cream/50">{gift}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}