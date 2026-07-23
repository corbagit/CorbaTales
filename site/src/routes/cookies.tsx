import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/cookies")({
  component: CookiesPage,
});

function CookiesPage() {
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

        <h1 className="text-heading text-4xl font-bold text-cream">Cookie Policy</h1>
        <p className="mt-2 text-sm text-cream/50 font-body">Last updated: July 20, 2026</p>

        <div className="mt-10 space-y-8 text-sm font-body leading-relaxed text-cream/70">
          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">1. What Are Cookies</h2>
            <p>
              Cookies are small text files stored on your device by your web browser. They help websites
              remember your preferences, understand how you use the site, and improve your experience.
              CorbaTales uses cookies and similar tracking technologies as described in this policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">2. How We Use Cookies</h2>
            <p>We use the following categories of cookies:</p>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="font-semibold text-cream">Essential Cookies</h3>
                <p className="mt-1">
                  Required for the Service to function. These include authentication cookies (Clerk),
                  session management, and security tokens. Disabling these will break core functionality.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-cream">Preference Cookies</h3>
                <p className="mt-1">
                  Remember your settings and preferences, such as your child's story preferences and
                  interface choices, to provide a personalized experience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-cream">Analytics Cookies</h3>
                <p className="mt-1">
                  Help us understand how users interact with CorbaTales — which features are used,
                  how stories are engaged with, and where improvements can be made. We use this data
                  to improve story quality and platform performance.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">3. Third-Party Cookies</h2>
            <p className="mb-3">
              Some cookies are set by third-party services we use:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li><strong>Clerk</strong> — authentication and session management cookies</li>
              <li><strong>Stripe</strong> — payment processing cookies (on checkout pages)</li>
              <li><strong>Vercel</strong> — analytics and performance monitoring</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">4. Managing Cookies</h2>
            <p>
              Most web browsers allow you to control cookies through browser settings. You can:
            </p>
            <ul className="ml-6 mt-2 list-disc space-y-1">
              <li>Block all cookies (may break site functionality)</li>
              <li>Delete existing cookies</li>
              <li>Set your browser to notify you when a cookie is set</li>
              <li>Use incognito/private browsing mode</li>
            </ul>
            <p className="mt-2">
              Note that disabling essential cookies will prevent the Service from functioning properly,
              including login, story generation, and voice recording features.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">5. Updates to This Policy</h2>
            <p>
              We may update this Cookie Policy from time to time. Changes will be posted on this page
              with an updated "Last updated" date. Continued use of the Service after changes
              constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-heading font-semibold text-cream">6. Contact</h2>
            <p>
              For questions about our use of cookies, contact us at{" "}
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