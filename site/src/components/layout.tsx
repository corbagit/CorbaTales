import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { Logo } from "~/components/Logo";
import { PUBLISHABLE_KEY } from "~/lib/auth";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const clerkLoaded = !!PUBLISHABLE_KEY;
  const { isSignedIn, user } = clerkLoaded ? useUser() : { isSignedIn: false, user: null };
  const { signOut } = clerkLoaded ? useClerk() : { signOut: () => {} };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-midnight/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Logo size="md" />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-ui font-medium text-cream/60 transition-colors hover:text-cream"
              activeProps={{ className: "text-cream" }}
            >
              {link.label}
            </Link>
          ))}
          {isSignedIn ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="text-sm font-ui font-medium text-cream/60 transition-colors hover:text-cream"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2">
                {user?.imageUrl && (
                  <img
                    src={user.imageUrl}
                    alt="Profile"
                    className="h-8 w-8 rounded-full border border-amber/30"
                  />
                )}
                <button
                  onClick={() => signOut()}
                  className="rounded-lg border border-white/10 px-3 py-1.5 text-xs font-ui text-cream/50 transition-colors hover:text-cream"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 text-sm font-ui font-medium text-cream/60 transition-colors hover:text-cream"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-gradient-cta px-5 py-2 text-sm font-ui font-semibold text-midnight transition-all hover:brightness-110 glow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-cream md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/5 bg-midnight/95 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="rounded-lg px-3 py-2 text-sm font-ui font-medium text-cream/60 transition-colors hover:text-cream"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <hr className="border-white/5 my-2" />
            {isSignedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="rounded-lg px-3 py-2 text-sm font-ui font-medium text-cream/60 transition-colors hover:text-cream"
                  onClick={() => setMobileOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="rounded-lg px-3 py-2 text-left text-sm font-ui font-medium text-cream/50 transition-colors hover:text-cream"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-lg px-3 py-2 text-sm font-ui font-medium text-cream/60 transition-colors hover:text-cream"
                  onClick={() => setMobileOpen(false)}
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="mt-1 rounded-lg bg-gradient-cta px-3 py-2 text-center text-sm font-ui font-semibold text-midnight"
                  onClick={() => setMobileOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-midnight">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo showTagline size="md" />
            <p className="mt-3 max-w-sm text-sm font-body text-cream/50">
              Every night, a brand-new story. Narrated in your voice. 
              Personalized for your child. Saved as a digital keepsake forever.
            </p>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-heading font-semibold text-cream">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/pricing" className="text-sm font-body text-cream/50 transition-colors hover:text-cream">Pricing</Link></li>
              <li><Link to="/dashboard" className="text-sm font-body text-cream/50 transition-colors hover:text-cream">Dashboard</Link></li>
              <li><Link to="/signup" className="text-sm font-body text-cream/50 transition-colors hover:text-cream">Get Started</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-3 text-sm font-heading font-semibold text-cream">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-sm font-body text-cream/50 transition-colors hover:text-cream">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-sm font-body text-cream/50 transition-colors hover:text-cream">Terms of Service</Link></li>
              <li><Link to="/cookies" className="text-sm font-body text-cream/50 transition-colors hover:text-cream">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-white/5 pt-6 text-center text-xs font-body text-cream/30">
          &copy; {new Date().getFullYear()} CorbaTales. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function Stars() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className={`star ${i % 3 === 0 ? 'star-large' : i % 2 === 0 ? 'star-medium' : 'star-small'}`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${2 + Math.random() * 4}s`,
            opacity: 0.2 + Math.random() * 0.5,
          }}
        />
      ))}
    </div>
  );
}