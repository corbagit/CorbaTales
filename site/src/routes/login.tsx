import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { PUBLISHABLE_KEY } from "~/lib/auth";

export const Route = createFileRoute("/login")({
  component: Login,
});

function Login() {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-[70dvh] items-center justify-center px-4 py-20">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
            <div className="mb-8 text-center">
              <div className="mb-4 text-4xl">🌙</div>
              <h1 className="font-heading text-2xl font-bold text-cream">Welcome Back</h1>
              <p className="mt-2 text-sm font-body text-cream/60">
                Log in to access your story library.
              </p>
            </div>
            <div className="rounded-xl border border-amber/20 bg-amber/10 p-4 text-sm font-body text-amber-300">
              ⚡ Auth not yet configured. Connect Clerk via the auth card to enable logins.
            </div>
            <div className="mt-6 border-t border-white/5 pt-6 text-center">
              <p className="text-sm font-body text-cream/60">
                Don't have an account?{" "}
                <Link to="/signup" className="font-semibold text-amber-400 hover:text-amber-300">
                  Sign up free
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
          <h1 className="font-heading text-2xl font-bold text-cream">Welcome Back</h1>
          <p className="mt-2 text-sm font-body text-cream/60">
            Log in to access your story library.
          </p>
        </div>
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
          <ClerkSignIn
            routing="hash"
            signUpUrl="/signup"
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