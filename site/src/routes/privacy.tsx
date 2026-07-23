import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
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

        <h1 className="text-heading text-4xl font-bold text-cream">Privacy Policy</h1>
        <p className="mt-2 text-sm text-cream/50 font-body">Last updated: July 20, 2026</p>

        <div className="mt-10 space-y-8 text-sm font-body leading-relaxed text-cream/70">
          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">1. Introduction</h2>
            <p>
              CorbaTales ("we," "our," or "us") is committed to protecting your privacy. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your information when you
              use our AI-powered bedtime story service.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">2. Information We Collect</h2>
            <h3 className="mb-2 font-semibold text-cream">Personal Information</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Account information: name, email address, and password (stored securely with bcrypt hashing)</li>
              <li>Payment information: processed securely through Stripe — we never store credit card details</li>
              <li>Voice recordings: audio samples you provide for voice cloning (3-minute reading script)</li>
              <li>Child profile information: name, age, interests, and story preferences (used only to personalize stories)</li>
            </ul>
            <h3 className="mt-4 mb-2 font-semibold text-cream">Usage Data</h3>
            <ul className="ml-6 list-disc space-y-1">
              <li>Story listening history and preferences</li>
              <li>Interaction with the platform (pages visited, features used)</li>
              <li>Device and browser information for analytics</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">3. How We Use Your Information</h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>To generate personalized bedtime stories based on your child's interests</li>
              <li>To create voice clones that narrate stories in your voice</li>
              <li>To process subscriptions and payments through Stripe</li>
              <li>To improve our AI models and story quality</li>
              <li>To send service-related communications (e.g., subscription confirmations)</li>
              <li>To provide customer support and respond to inquiries</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">4. Voice Recording and AI Training</h2>
            <p>
              Your voice recording is used exclusively to narrate stories for your account. We use
              ElevenLabs' voice cloning technology to create a voice model. This model is stored securely
              and is never shared with third parties. You may delete your voice recording at any time
              from your account settings, which will also remove the associated voice model.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">5. Data Security</h2>
            <p>
              We implement industry-standard security measures including encryption at rest and in transit,
              secure API authentication, and regular security audits. Your data is stored on secure servers
              with access controls. However, no method of transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">6. Data Retention</h2>
            <p>
              We retain your account information and story library for as long as your account is active.
              If you cancel your subscription, your data is retained for 30 days before being permanently
              deleted. You may request immediate deletion by contacting support.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">7. Third-Party Services</h2>
            <p>We use the following third-party services:</p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li><strong>Stripe</strong> — payment processing (see their privacy policy)</li>
              <li><strong>OpenAI</strong> — story generation and illustration creation</li>
              <li><strong>ElevenLabs</strong> — voice cloning and text-to-speech narration</li>
              <li><strong>Clerk</strong> — authentication and user management</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">8. Children's Privacy</h2>
            <p>
              CorbaTales is designed for use by parents and guardians. We do not knowingly collect
              personal information from children under 13 without parental consent. Child profile
              information (name, age, interests) is provided and controlled by the parent or guardian.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">9. Your Rights</h2>
            <ul className="ml-6 list-disc space-y-1">
              <li>Access and review your personal data</li>
              <li>Request correction or deletion of your data</li>
              <li>Export your story library and voice recordings</li>
              <li>Withdraw consent for voice processing</li>
              <li>Delete your account and all associated data</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">10. Contact</h2>
            <p>
              For privacy-related inquiries, contact us at{" "}
              <a href="mailto:privacy@corbatales.com" className="text-golden-amber hover:underline">
                privacy@corbatales.com
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}