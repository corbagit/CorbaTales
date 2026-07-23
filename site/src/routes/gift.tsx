import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/gift")({
  component: Gift,
});

function Gift() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-radial from-amber/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-block">
            <span className="rounded-full border border-amber/20 bg-amber/10 px-4 py-1.5 text-xs font-ui font-medium text-amber-200">
              🎁 The Perfect Gift
            </span>
          </div>

          <h1 className="font-heading text-4xl font-extrabold leading-tight text-cream sm:text-5xl md:text-6xl">
            Gift the Magic of
            <br />
            <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-lavender-300 bg-clip-text text-transparent">
              Bedtime Storytelling
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg font-body text-cream/60 sm:text-xl">
            Give the gift of a brand-new bedtime story every night — narrated in{" "}
            <span className="text-amber-300 font-semibold">your voice</span>.
            Perfect for grandparents, aunts, uncles, and anyone who wants to be there at bedtime.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-amber px-8 py-3.5 text-base font-ui font-semibold text-midnight transition-all hover:brightness-110 animate-pulse-glow"
            >
              🎁 Gift a Subscription
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-ui font-semibold text-cream transition-all hover:bg-white/10"
            >
              How It Works
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {["👵", "👴", "👩‍🦳", "👨‍🦳"].map((emoji, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-midnight bg-gradient-to-br from-amber to-lavender text-xs font-bold text-white"
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p className="text-sm font-body text-cream/40">
              <span className="text-amber font-semibold">200+</span> grandparents already reading nightly
            </p>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 text-4xl opacity-20 animate-float-slow">🎀</div>
        <div className="pointer-events-none absolute right-1/4 top-1/3 text-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>💝</div>
        <div className="pointer-events-none absolute left-1/3 bottom-1/4 text-2xl opacity-20 animate-float-slow" style={{ animationDelay: '2s' }}>🌟</div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-cream sm:text-4xl">
              How Gift Delivery Works
            </h2>
            <p className="mt-3 text-lg font-body text-cream/50">
              Five simple steps to give the gift of storytime
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3 lg:grid-cols-5">
            {[
              {
                step: "01",
                emoji: "🎁",
                title: "Choose a Plan",
                desc: "Pick monthly or annual. One click, no hassle.",
                border: "border-amber/20",
                color: "from-amber/20 to-amber/5",
              },
              {
                step: "02",
                emoji: "🎤",
                title: "Record Your Voice",
                desc: "Record a short 3-minute script. We guide you through it.",
                border: "border-lavender/20",
                color: "from-lavender/20 to-lavender/5",
              },
              {
                step: "03",
                emoji: "🎨",
                title: "Personalize",
                desc: "Tell us about the child — age, interests, favorite things.",
                border: "border-teal/20",
                color: "from-teal/20 to-teal/5",
              },
              {
                step: "04",
                emoji: "💌",
                title: "Gift Delivered",
                desc: "We send a beautiful gift email to the parent with your message.",
                border: "border-amber/20",
                color: "from-amber/20 to-amber/5",
              },
              {
                step: "05",
                emoji: "🌙",
                title: "Stories Begin",
                desc: "Every night, a new story in your voice. Pure magic.",
                border: "border-lavender/20",
                color: "from-lavender/20 to-lavender/5",
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`group rounded-2xl border ${item.border} bg-gradient-to-b ${item.color} p-6 text-center transition-all hover:scale-[1.02]`}
              >
                <div className="mb-4 text-4xl transition-transform group-hover:scale-110">{item.emoji}</div>
                <span className="text-xs font-ui font-semibold uppercase tracking-widest text-amber-300">
                  Step {item.step}
                </span>
                <h3 className="mt-2 font-heading text-lg font-bold text-cream">{item.title}</h3>
                <p className="mt-2 text-sm font-body leading-relaxed text-cream/50">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY GRANDPARENTS LOVE IT ===== */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-cream sm:text-4xl">
              Why Grandparents ❤️ CorbaTales
            </h2>
            <p className="mt-3 text-lg font-body text-cream/50">
              More than a gift — it's a nightly connection
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🗣️",
                title: "Your Voice, Their Comfort",
                desc: "Even from across the country, they hear you every night. The warmth of your voice is the best gift of all.",
              },
              {
                icon: "📱",
                title: "No Tech Skills Needed",
                desc: "Just record once — we walk you through it. No apps to manage, nothing complicated. It just works.",
              },
              {
                icon: "💝",
                title: "Beautiful Gift Delivery",
                desc: "We send a personalized digital gift card with your message. It's like unwrapping a hug.",
              },
              {
                icon: "🔄",
                title: "Never the Same Story Twice",
                desc: "AI generates fresh stories every night. Your grandchild will never hear the same tale twice.",
              },
              {
                icon: "📚",
                title: "Digital Keepsakes Forever",
                desc: "Every story saved. Parents can replay favorites and even order a printed hardcover book.",
              },
              {
                icon: "💰",
                title: "Less Than a Coffee a Week",
                desc: "At just $8.33/month on the annual plan, it's a small price for priceless bedtime memories.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3 className="font-heading text-lg font-bold text-cream">{feature.title}</h3>
                <p className="mt-2 text-sm font-body leading-relaxed text-cream/50">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-cream sm:text-4xl">
              Simple Gift Pricing
            </h2>
            <p className="mt-3 text-lg font-body text-cream/50">
              Choose the perfect gift. No commitment for the recipient.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {/* Gift Monthly */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10">
              <h3 className="font-heading text-lg font-semibold text-cream">Gift Monthly</h3>
              <div className="mt-4 flex items-baseline">
                <span className="font-heading text-5xl font-bold text-cream">$12.99</span>
                <span className="ml-1 font-body text-cream/50">/mo</span>
              </div>
              <p className="mt-2 text-sm font-body text-cream/50">30 fresh stories per month</p>
              <ul className="mt-6 space-y-3">
                {[
                  "Stories in your voice",
                  "Original AI illustrations",
                  "Unlimited story library",
                  "Beautiful gift delivery",
                  "Cancel anytime",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-body text-cream/70">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="mt-8 block w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-center font-ui text-sm font-semibold text-cream transition-all hover:bg-white/10"
              >
                Gift Monthly
              </Link>
            </div>

            {/* Gift Annual (featured) */}
            <div className="relative rounded-2xl border border-amber/30 bg-gradient-to-b from-amber/10 to-transparent p-8 glow-gold">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-amber px-4 py-1 text-xs font-ui font-semibold text-midnight">
                  Best Value 🎁
                </span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-cream">Gift a Whole Year</h3>
              <div className="mt-4 flex items-baseline">
                <span className="font-heading text-5xl font-bold text-cream">$99.99</span>
                <span className="ml-1 font-body text-cream/50">/yr</span>
              </div>
              <p className="mt-2 text-sm font-body">
                <span className="text-amber font-semibold">Save 35%</span>{" "}
                <span className="text-cream/50">— just $8.33/mo</span>
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  "Everything in Monthly",
                  "Bonus holiday story arcs",
                  "Episodic story series",
                  "Priority story quality",
                  "Best value — save 35%",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-body text-cream/70">
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup"
                className="mt-8 block w-full rounded-xl bg-amber px-6 py-3.5 text-center font-ui text-sm font-semibold text-midnight transition-all hover:brightness-110"
              >
                Gift a Year
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-body text-cream/40">
              Plus: Physical keepsake hardcovers available for{" "}
              <span className="text-cream">$24.99</span> (+ Shipping &amp; Handling) — their 10 favorite stories in print.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="font-heading text-3xl font-bold text-cream sm:text-4xl">
              What Gift-Givers Say
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "I live 3,000 miles from my granddaughter. Now I read to her every single night. When she visited last month, the first thing she said was 'You sound just like my bedtime stories!' I cried.",
                author: "Patricia L.",
                role: "Grandmother of a 6-year-old",
              },
              {
                quote: "My son was deployed overseas and I bought this so his kids could hear 'Daddy's stories' every night. It made a hard time a little bit softer. This is genuinely life-changing.",
                author: "Janet M.",
                role: "Grandmother, military family",
              },
              {
                quote: "I bought the annual gift for all three of my grandkids. Recording my voice was so easy — and the personalized gift cards brought my daughter-in-law to tears.",
                author: "Robert K.",
                role: "Grandfather of three",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-4 w-4 text-amber" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm font-body leading-relaxed text-cream/70">"{testimonial.quote}"</p>
                <div className="mt-4 border-t border-white/5 pt-4">
                  <p className="text-sm font-body font-semibold text-cream">{testimonial.author}</p>
                  <p className="text-xs font-body text-cream/40">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GIFT DELIVERY PREVIEW ===== */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl border border-amber/20 bg-gradient-to-b from-amber/10 to-transparent p-12 glow-gold">
            <h2 className="font-heading text-3xl font-bold text-cream sm:text-4xl">
              Give the gift of
              <br />
              <span className="text-gradient">bedtime stories</span>
            </h2>
            <p className="mx-auto mt-4 max-w-lg font-body text-cream/50">
              Your voice. Their imagination. A new adventure every night.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm font-body text-cream/30">
              Record once. Personalized stories. Beautiful gift delivery. 
              No account needed for the recipient.
            </p>
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-amber px-8 py-3.5 text-base font-ui font-semibold text-midnight transition-all hover:brightness-110 animate-pulse-glow"
            >
              🎁 Gift a Subscription Now
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-4 text-xs font-body text-cream/30">No credit card needed. Cancel anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}