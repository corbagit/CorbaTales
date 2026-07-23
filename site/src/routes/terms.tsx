import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-1 text-sm text-cream/50 hover:text-cream font-ui"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to home
        </Link>

        <h1 className="text-heading text-4xl font-bold text-cream">Terms of Service</h1>
        <p className="mt-2 text-sm text-cream/50 font-body">Last updated: July 20, 2026</p>

        <div className="mt-10 space-y-8 text-sm font-body leading-relaxed text-cream/70">
          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">1. Acceptance of Terms</h2>
            <p>
              By accessing or using CorbaTales ("the Service"), you agree to be bound by these Terms of
              Service. If you do not agree, please do not use the Service. We reserve the right to update
              these terms at any time; continued use constitutes acceptance of changes.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">2. Description of Service</h2>
            <p>
              CorbaTales is an AI-powered bedtime story platform that generates personalized stories
              narrated in the user's voice. The Service includes story generation, voice cloning,
              illustration creation, digital story library, and optional printed keepsake books.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">3. Account Registration</h2>
            <p>
              You must create an account to use the Service. You are responsible for maintaining the
              confidentiality of your account credentials and for all activities under your account.
              You must provide accurate, current, and complete information during registration.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">4. Subscriptions and Payments</h2>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Monthly:</strong> $12.99/month — automatic renewal unless cancelled</li>
              <li><strong>Annual:</strong> $99.99/year — saves 35% vs monthly</li>
              <li><strong>Gift:</strong> $12.99/month or $99.99/year — non-refundable after delivery</li>
              <li><strong>Physical keepsake:</strong> $24.99 per hardcover book (shipping extra)</li>
            </ul>
            <p className="mt-3">
              Payments are processed securely through Stripe. Subscriptions auto-renew until cancelled.
              You can cancel anytime from your dashboard; access continues until the end of the billing period.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">5. Free Trial</h2>
            <p>
              New users may receive a free trial period. At the end of the trial, your subscription will
              begin unless you cancel before the trial ends. Only one trial per user is permitted.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">6. Cancellation and Refunds</h2>
            <p>
              You may cancel your subscription at any time. No partial refunds are provided for
              unused portions of a billing period. Refunds for physical keepsake books are handled
              on a case-by-case basis within 30 days of purchase.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">7. Voice Recording License</h2>
            <p>
              By providing a voice recording, you grant CorbaTales a limited license to use the
              recording solely for generating narrated stories for your account. The voice model
              is created and stored by ElevenLabs and is not shared with third parties. You may
              delete your voice recording at any time.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">8. Intellectual Property</h2>
            <p>
              Stories generated through the Service are personal to you and may be saved, shared, and
              printed for personal use. The CorbaTales platform, branding, and underlying technology
              are our intellectual property. You may not reproduce, distribute, or create derivative
              works of the Service without our permission.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">9. Acceptable Use</h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>You may not use the Service for any illegal purpose</li>
              <li>You may not attempt to reverse-engineer the AI models</li>
              <li>You may not generate harmful, abusive, or inappropriate content</li>
              <li>You may not share your account credentials with others</li>
              <li>You may not use automated scripts to access the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">10. Limitation of Liability</h2>
            <p>
              CorbaTales is provided "as is" without warranties of any kind. We are not liable for
              damages arising from use of the Service, including but not limited to loss of data,
              service interruptions, or content generated by AI. Our total liability is limited to
              the amount paid by you in the 12 months preceding a claim.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">11. Termination</h2>
            <p>
              We reserve the right to suspend or terminate accounts that violate these terms. Upon
              termination, you will lose access to your story library. We will provide a 7-day notice
              before termination for non-violation reasons.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">12. Contact</h2>
            <p>
              For questions about these terms, contact us at{" "}
              <a href="mailto:support@corbatales.com" className="text-golden-amber hover:underline">
                support@corbatales.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}