import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SignUp as ClerkSignUp } from "@clerk/clerk-react";
import { PUBLISHABLE_KEY } from "~/lib/auth";

export const Route = createFileRoute("/signup")({
  component: SignUp,
});

function SignUp() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-[70dvh] items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
            <div className="mb-8 text-center">
              <div className="mb-4 text-4xl">🌙</div>
              <h1 className="font-heading text-2xl font-bold text-cream">Create Your Account</h1>
              <p className="mt-2 text-sm font-body text-cream/60">
                Start your free trial — no credit card needed.
              </p>
            </div>
            <div className="rounded-xl border border-amber/20 bg-amber/10 p-4 text-sm font-body text-amber-300">
              ⚡ Auth not yet configured. Connect Clerk via the auth card to enable signups.
            </div>
            <div className="mt-6 border-t border-white/5 pt-6 text-center">
              <p className="text-sm font-body text-cream/60">
                Already have an account?{" "}
                <Link to="/login" className="font-semibold text-amber-400 hover:text-amber-300">
                  Log in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[70dvh] items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 text-4xl">🌙</div>
          <h1 className="font-heading text-2xl font-bold text-cream">Create Your Account</h1>
          <p className="mt-2 text-sm font-body text-cream/60">
            Start your free trial — no credit card needed.
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
          <ClerkSignUp
            routing="hash"
            signInUrl="/login"
            appearance={{
              elements: {
                rootBox: "w-full",
                card: "bg-transparent shadow-none",
                headerTitle: "hidden",
                headerSubtitle: "hidden",
                socialButtonsBlockButton: "border-white/10 text-cream hover:bg-white/5",
                socialButtonsBlockButtonText: "text-cream/70",
                dividerLine: "bg-white/5",
                dividerText: "text-cream/50",
                formFieldInput: "bg-white/5 border-white/10 text-cream rounded-xl",
                formFieldLabel: "text-cream/70",
                formButtonPrimary: "bg-gradient-cta text-midnight font-ui font-semibold border-none w-full rounded-xl py-3 hover:brightness-110",
                footerAction: "text-cream/60",
                footerActionLink: "text-amber-400 hover:text-amber-300",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}