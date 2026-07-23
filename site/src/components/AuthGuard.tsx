import { Link } from "@tanstack/react-router";
import { useUser, SignIn } from "@clerk/clerk-react";
import type { ReactNode } from "react";
import { PUBLISHABLE_KEY } from "~/lib/auth";

export function AuthGuard({ children }: { children: ReactNode }) {
  if (!PUBLISHABLE_KEY) {
    return (
      <div className="flex min-h-[70dvh] items-center justify-center px-4 py-20">
        <div className="max-w-md text-center">
          <div className="mb-4 text-5xl">🔐</div>
          <h1 className="font-heading text-2xl font-bold text-cream">Authentication Not Configured</h1>
          <p className="mt-3 text-sm font-body text-cream/60">
            This page requires user authentication. Connect Clerk via the auth card
            to enable signups and logins.
          </p>
          <Link
            to="/"
            className="mt-6 inline-block rounded-xl bg-gradient-cta px-6 py-3 text-sm font-ui font-semibold text-midnight transition-all hover:brightness-110"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const AuthContent = () => {
    const { isLoaded, isSignedIn } = useUser();

    if (!isLoaded) {
      return (
        <div className="flex min-h-[70dvh] items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber border-t-transparent" />
            <p className="text-sm font-body text-cream/50">Loading...</p>
          </div>
        </div>
      );
    }

    if (!isSignedIn) {
      return (
        <div className="flex min-h-[70dvh] items-center justify-center px-4 py-20">
          <div className="w-full max-w-md">
            <div className="mb-8 text-center">
              <div className="mb-4 text-4xl">🌙</div>
              <h1 className="font-heading text-2xl font-bold text-cream">Sign in to continue</h1>
              <p className="mt-2 text-sm font-body text-cream/60">
                You need to be logged in to access this page.
              </p>
            </div>
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-8">
              <SignIn
                routing="hash"
                signUpUrl="/signup"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "bg-transparent shadow-none",
                    headerTitle: "text-cream text-xl font-heading font-bold",
                    headerSubtitle: "text-cream/60 font-body",
                    formButtonPrimary: "bg-gradient-cta text-midnight font-ui font-semibold border-none hover:brightness-110",
                    formFieldInput: "bg-white/5 border-white/10 text-cream rounded-xl font-ui",
                    formFieldLabel: "text-cream/70 font-body",
                    footerActionLink: "text-amber-400 hover:text-amber-300 font-body",
                    dividerLine: "bg-white/5",
                    dividerText: "text-cream/50 font-body",
                    socialButtonsBlockButton: "border-white/10 text-cream hover:bg-white/5 font-body",
                    socialButtonsBlockButtonText: "text-cream/70 font-body",
                  },
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    return <>{children}</>;
  };

  return <AuthContent />;
}
