import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import StoryDemo from "~/components/StoryDemo";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div>
      {/* ===== HERO ===== */}
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="pointer-events-none absolute inset-0 bg-gradient-midnight opacity-60" />

        <div className="relative mx-auto max-w-5xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-block">
            <span className="rounded-full border border-amber/20 bg-amber/10 px-4 py-1.5 text-xs font-ui font-medium text-amber-300">
              ✨ AI-Powered Bedtime Stories
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-heading text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl lg:text-7xl">
            <span className="text-gradient">A brand-new bedtime story</span>
            <br />
            <span className="text-cream">every night in</span>
            <br />
            <span className="bg-gradient-to-r from-amber-300 to-amber-400 bg-clip-text text-transparent">
              your voice
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-lg font-body text-cream/60 sm:text-xl">
            Record 3 minutes once. Tell us about your child's interests. 
            Each night, AI creates a fresh, original story — narrated by you, 
            illustrated, and saved forever.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2 rounded-xl bg-gradient-cta px-8 py-3.5 text-base font-ui font-semibold text-midnight transition-all hover:brightness-110 animate-pulse-glow"
            >
              Start Your Free Trial
              <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-8 py-3.5 text-base font-ui font-semibold text-cream transition-all hover:bg-white/10"
            >
              See How It Works
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          {/* Social proof */}
          <div className="mt-12 flex flex-col items-center gap-3">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-midnight bg-gradient-to-br from-amber-400 to-amber-500 text-xs font-bold text-midnight"
                >
                  {["👩", "👨", "👩‍🦰", "👨‍🦱"][i - 1]}
                </div>
              ))}
            </div>
            <p className="text-sm font-body text-cream/50">
              <span className="text-amber-400 font-semibold">500+</span> parents already creating nightly stories
            </p>
          </div>
        </div>

        {/* Floating decorative elements */}
        <div className="pointer-events-none absolute left-1/4 top-1/4 text-4xl opacity-20 animate-float-slow">🌟</div>
        <div className="pointer-events-none absolute right-1/4 top-1/3 text-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}>🌙</div>
        <div className="pointer-events-none absolute left-1/3 bottom-1/4 text-2xl opacity-20 animate-float-slow" style={{ animationDelay: '2s' }}>📖</div>
      </section>

      {/* ===== INTERACTIVE STORY DEMO ===== */}
      <StoryDemo />

      {/* ===== HOW IT WORKS ===== */}
      <section id="how-it-works" className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-heading text-3xl font-bold text-cream sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-3 text-lg font-body text-cream/60">
              Three simple steps to magical bedtime stories
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                emoji: "🎤",
                title: "Record Your Voice",
                desc: "Read a short script for 3 minutes. Our AI learns your voice's tone, cadence, and warmth — so every story sounds like you.",
                color: "from-amber/20 to-amber/5",
                border: "border-amber/20",
              },
              {
                step: "02",
                emoji: "🎨",
                title: "Set Your Child's Interests",
                desc: "Answer a few quick questions — favorite animals, characters, hobbies, and values. The AI uses this to craft stories they'll love.",
                color: "from-lavender/20 to-lavender/5",
                border: "border-lavender/20",
              },
              {
                step: "03",
                emoji: "🌙",
                title: "A New Story Every Night",
                desc: "Each night, a fresh, original story with illustrations is generated just for them — narrated in your voice, ready to play.",
                color: "from-teal/20 to-teal/5",
                border: "border-teal/20",
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`group rounded-2xl border ${item.border} bg-gradient-to-b ${item.color} p-8 transition-all hover:scale-[1.02] hover:glow-sm`}
              >
                <div className="mb-4 text-4xl">{item.emoji}</div>
                <span className="text-xs font-ui font-semibold uppercase tracking-widest text-amber-400">
                  Step {item.step}
                </span>
                <h3 className="mt-2 text-xl font-heading font-bold text-cream">{item.title}</h3>
                <p className="mt-3 text-sm font-body leading-relaxed text-cream/60">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-heading text-3xl font-bold text-cream sm:text-4xl">
              Why Parents Love CorbaTales
            </h2>
            <p className="mt-3 text-lg font-body text-cream/60">
              More than a story — it's a keepsake of your love
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "🗣️",
                title: "Your Voice, Every Night",
                desc: "Even when you're traveling or working late, your child hears your voice. No more guilt — just connection.",
              },
              {
                icon: "✨",
                title: "Never the Same Story Twice",
                desc: "AI generates a unique tale each night. No repeats, no reruns — always a fresh adventure.",
              },
              {
                icon: "🎨",
                title: "Original Illustrations",
                desc: "Every story comes with beautiful, custom AI-generated illustrations that bring the tale to life.",
              },
              {
                icon: "💾",
                title: "Saved Forever",
                desc: "Every story is stored in your digital library. Replay favorites, build a collection, make bedtime magical.",
              },
              {
                icon: "🎯",
                title: "Perfectly Personalized",
                desc: "Stories adapt to your child's age, interests, and even the life lessons you want to teach.",
              },
              {
                icon: "📚",
                title: "Physical Keepsakes",
                desc: "Print your child's favorite 10 stories as a beautiful hardcover book ($24.99 + Shipping &amp; Handling). A treasure they'll keep forever.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 transition-all hover:border-white/10 hover:bg-white/[0.04]"
              >
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3 className="text-lg font-heading font-bold text-cream">{feature.title}</h3>
                <p className="mt-2 text-sm font-body leading-relaxed text-cream/60">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-heading text-3xl font-bold text-cream sm:text-4xl">
              Simple, Magical Pricing
            </h2>
            <p className="mt-3 text-lg font-body text-cream/60">
              Start with a free trial. No commitment, no risk.
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {/* Monthly */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10">
              <h3 className="text-lg font-heading font-semibold text-cream">Monthly</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-heading font-bold text-cream">$12.99</span>
                <span className="ml-1 font-body text-cream/50">/mo</span>
              </div>
              <p className="mt-2 text-sm font-body text-cream/50">30 fresh stories per month</p>
              <ul className="mt-6 space-y-3">
                {["Brand-new story every night", "Voice narration included", "Original illustrations", "Unlimited story library", "Cancel anytime"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-2 text-sm font-body text-cream/70">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <Link
                to="/signup"
                className="mt-8 block w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-ui font-semibold text-cream transition-all hover:bg-white/10"
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
                <span className="text-4xl font-heading font-bold text-cream">$99.99</span>
                <span className="ml-1 font-body text-cream/50">/yr</span>
              </div>
              <p className="mt-2 text-sm font-body">
                <span className="text-amber-400 font-semibold">Save 35%</span>{" "}
                <span className="text-cream/50">— just $8.33/mo</span>
              </p>
              <ul className="mt-6 space-y-3">
                {["Everything in Monthly", "Bonus holiday story arcs", "Episodic story series", "Priority story quality", "Best value"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-2 text-sm font-body text-cream/70">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <Link
                to="/signup"
                className="mt-8 block w-full rounded-xl bg-gradient-cta px-6 py-3 text-center text-sm font-ui font-semibold text-midnight transition-all hover:brightness-110"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Gift */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-white/10">
              <h3 className="text-lg font-heading font-semibold text-cream">Gift Subscription</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-4xl font-heading font-bold text-cream">$12.99</span>
                <span className="ml-1 font-body text-cream/50">/mo gift</span>
              </div>
              <p className="mt-2 text-sm font-body text-cream/50">Or $99.99 for a year</p>
              <ul className="mt-6 space-y-3">
                {["Stories in *your* voice", "Perfect for grandparents", "Beautiful gift delivery", "No account needed for recipient", "Share the magic"].map(
                  (item) => (
                    <li key={item} className="flex items-start gap-2 text-sm font-body text-cream/70">
                      <svg className="mt-0.5 h-4 w-4 shrink-0 text-lavender-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {item}
                    </li>
                  ),
                )}
              </ul>
              <Link
                to="/signup"
                className="mt-8 block w-full rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-center text-sm font-ui font-semibold text-cream transition-all hover:bg-white/10"
              >
                Gift Now
              </Link>
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-sm font-body text-cream/50">
              Plus: Physical keepsake hardcovers available for <span className="text-amber-400">$24.99</span> (+ Shipping &amp; Handling) — your child's 10 favorite stories in print.
            </p>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <h2 className="text-heading text-3xl font-bold text-cream sm:text-4xl">
              What Parents Are Saying
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                quote: "My daughter asks for 'Daddy's story' every night. Even when I'm on a business trip, she hears my voice. It's magic.",
                author: "Michael R.",
                role: "Father of a 4-year-old",
              },
              {
                quote: "I bought the annual subscription for my grandson. Recording my voice was so easy, and he absolutely loves hearing 'Grandma's stories.'",
                author: "Patricia L.",
                role: "Grandmother of a 6-year-old",
              },
              {
                quote: "As a working mom, I felt so guilty about missing bedtime. CorbaTales lets me be there even when I'm not. The stories are incredible.",
                author: "Sarah K.",
                role: "Mother of a 3-year-old",
              },
            ].map((testimonial) => (
              <div
                key={testimonial.author}
                className="rounded-2xl border border-white/5 bg-white/[0.02] p-6"
              >
                <div className="mb-4 flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="h-4 w-4 text-star-gold" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm font-body leading-relaxed text-cream/70">"{testimonial.quote}"</p>
                <div className="mt-4 border-t border-white/5 pt-4">
                  <p className="text-sm font-heading font-semibold text-cream">{testimonial.author}</p>
                  <p className="text-xs font-body text-cream/50">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-heading text-3xl font-bold text-cream sm:text-4xl">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {[
              {
                q: "How does the voice recording work?",
                a: "You read a short script for about 3 minutes. Our AI analyzes your voice's unique characteristics — tone, cadence, warmth — and uses it to narrate every story. It sounds exactly like you.",
              },
              {
                q: "Is my child's data safe?",
                a: "Absolutely. We never share your child's information or preferences. Your voice recording is encrypted and used only to generate stories for your account. You can delete it anytime.",
              },
              {
                q: "Can I preview a story before my child hears it?",
                a: "Yes! Every story is generated and available in your library. You can listen, edit, or regenerate before sharing with your child.",
              },
              {
                q: "What if I don't like a story?",
                a: "Just regenerate it! You can adjust the parameters — character, theme, length — and get a new version instantly. No limits.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Yes. No contracts, no hidden fees. Cancel from your dashboard, and you'll keep access to your story library until the end of your billing period.",
              },
              {
                q: "How do physical keepsake books work?",
                a: "From your story library, select your child's 10 favorite stories. We'll print them as a beautiful hardcover illustrated book and ship it to your door for $24.99 (+ Shipping &amp; Handling).",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="group rounded-2xl border border-white/5 bg-white/[0.02] transition-all hover:border-white/10"
              >
                <summary className="flex cursor-pointer items-center justify-between px-6 py-4 text-sm font-ui font-semibold text-cream">
                  {faq.q}
                  <svg
                    className="h-4 w-4 shrink-0 text-cream/50 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-6 pb-4">
                  <p className="text-sm font-body leading-relaxed text-cream/60">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="border-t border-white/5 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="rounded-3xl border border-amber/20 bg-gradient-card p-12 glow">
            <h2 className="text-heading text-3xl font-bold text-cream sm:text-4xl">
              Ready to Make Bedtime Magical?
            </h2>
            <p className="mx-auto mt-4 max-w-lg font-body text-cream/60">
              Join 500+ parents who never miss a bedtime story. Start your free trial today — no credit card required.
            </p>
            <Link
              to="/signup"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-gradient-cta px-8 py-3.5 text-base font-ui font-semibold text-midnight transition-all hover:brightness-110 animate-pulse-glow"
            >
              Start Your Free Trial
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-4 text-xs font-body text-cream/50">No credit card needed. Cancel anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}