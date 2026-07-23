import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { ClerkProvider } from "@clerk/clerk-react";
import type { ReactNode } from "react";
import appCss from "~/styles/app.css?url";
import { Footer, Header, Stars } from "~/components/layout";
import { PUBLISHABLE_KEY } from "~/lib/auth";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CorbaTales — AI Bedtime Stories Narrated in Your Voice" },
      {
        name: "description",
        content:
          "Every night, a brand-new AI-generated bedtime story for your child — narrated in your voice. Personalized, illustrated, saved forever.",
      },
      { name: "og:title", content: "CorbaTales — AI Bedtime Stories in Your Voice" },
      {
        name: "og:description",
        content:
          "Every night, a brand-new AI-generated bedtime story for your child — narrated in your voice. Personalized, illustrated, saved forever.",
      },
      { name: "og:type", content: "website" },
      { name: "og:image", content: "/og-image.png" },
      { name: "og:image:width", content: "1200" },
      { name: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CorbaTales — AI Bedtime Stories in Your Voice" },
      { name: "twitter:image", content: "/og-image.png" },
      { name: "theme-color", content: "#1B1B3A" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "CorbaTales" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/manifest.json" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "preconnect",
        href: "https://fonts.gstatic.com",
        crossOrigin: "anonymous",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  notFoundComponent: () => (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient">Page not found</h1>
        <p className="mt-2 text-gray-400">The story you're looking for doesn't exist yet.</p>
      </div>
    </div>
  ),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Stars />
      <Header />
      <main className="min-h-dvh pt-16">
        <Outlet />
      </main>
      <Footer />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  if (!PUBLISHABLE_KEY) {
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          {children}
          <Scripts />
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
          {children}
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}