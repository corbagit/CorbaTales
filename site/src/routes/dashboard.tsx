import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { AuthGuard } from "~/components/AuthGuard";
import { createCheckoutSession } from "~/lib/stripe-server";

export const Route = createFileRoute("/dashboard")({
  component: () => (
    <AuthGuard>
      <Dashboard />
    </AuthGuard>
  ),
});

function Dashboard() {
  const { user } = useUser();
  const [creatingCheckout, setCreatingCheckout] = useState(false);

  // Mock story data — will be replaced with real data from the DB
  const recentStories = [
    { id: "1", title: "The Brave Little Star", date: "Tonight", child: "Leo" },
    { id: "2", title: "Luna and the Moonlit Garden", date: "Yesterday", child: "Leo" },
    { id: "3", title: "Captain Whiskers' Ocean Adventure", date: "2 days ago", child: "Leo" },
  ];

  const handleSubscribe = async () => {
    setCreatingCheckout(true);
    try {
      const result = await createCheckoutSession({
        data: {
          plan: "monthly",
          userId: user?.id || "",
          email: user?.primaryEmailAddress?.emailAddress || "",
        },
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (err) {
      console.error("Checkout error:", err);
    } finally {
      setCreatingCheckout(false);
    }
  };

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Welcome header */}
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-white font-heading">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ""} ✨
            </h1>
            <p className="mt-2 text-gray-400 font-body">
              Your stories are ready for tonight.
            </p>
          </div>
          <div className="flex gap-3">
            {user?.imageUrl && (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="h-10 w-10 rounded-full border-2 border-golden-amber/30"
              />
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="mb-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            to="/dashboard/library"
            className="group rounded-2xl border border-golden-amber/20 bg-gradient-to-b from-golden-amber/10 to-transparent p-6 text-center transition-all hover:glow-gold"
          >
            <div className="mb-3 text-3xl transition-transform group-hover:scale-110">✨</div>
            <h3 className="font-semibold text-white font-heading">Generate Tonight's Story</h3>
            <p className="mt-1 text-xs text-gray-400">A brand-new tale awaits</p>
          </Link>
          <Link
            to="/dashboard/voice"
            className="group rounded-2xl border border-lavender-soft/20 bg-gradient-to-b from-lavender-soft/10 to-transparent p-6 text-center transition-all hover:glow-lavender"
          >
            <div className="mb-3 text-3xl transition-transform group-hover:scale-110">🎤</div>
            <h3 className="font-semibold text-white font-heading">Record Your Voice</h3>
            <p className="mt-1 text-xs text-gray-400">3 minutes to personalize</p>
          </Link>
          <Link
            to="/dashboard/library"
            className="group rounded-2xl border border-amber-500/20 bg-gradient-to-b from-amber-500/10 to-transparent p-6 text-center transition-all hover:glow-sm"
          >
            <div className="mb-3 text-3xl transition-transform group-hover:scale-110">📚</div>
            <h3 className="font-semibold text-white font-heading">Story Library</h3>
            <p className="mt-1 text-xs text-gray-400">Browse all your stories</p>
          </Link>
          <Link
            to="/dashboard/settings"
            className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center transition-all hover:border-white/20"
          >
            <div className="mb-3 text-3xl transition-transform group-hover:scale-110">👶</div>
            <h3 className="font-semibold text-white font-heading">Child Preferences</h3>
            <p className="mt-1 text-xs text-gray-400">Customize story themes</p>
          </Link>
        </div>

        {/* Story grid */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white font-heading">Recent Stories</h2>
            <Link
              to="/dashboard/library"
              className="text-sm text-golden-amber hover:text-amber-400 font-ui"
            >
              View all
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {recentStories.map((story) => (
            <div
              key={story.id}
              className="group cursor-pointer rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="rounded-lg bg-golden-amber/10 p-2 text-xl">📖</div>
                <span className="text-xs text-gray-500">{story.date}</span>
              </div>
              <h3 className="font-semibold text-white font-heading">{story.title}</h3>
              <p className="mt-1 text-xs text-gray-500">
                For {story.child} • 5 min read
              </p>
              <div className="mt-4 flex gap-2">
                <button className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/10">
                  ▶ Play
                </button>
                <button className="rounded-lg bg-white/5 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-white/10">
                  📋 Read
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if no stories */}
        {recentStories.length === 0 && (
          <div className="rounded-2xl border border-dashed border-white/10 p-16 text-center">
            <div className="mb-4 text-5xl">🌙</div>
            <h3 className="text-lg font-semibold text-white font-heading">No stories yet</h3>
            <p className="mt-2 text-sm text-gray-400 font-body">
              Record your voice and set your child's preferences to generate your first story.
            </p>
            <Link
              to="/dashboard/voice"
              className="mt-6 inline-block rounded-xl bg-golden-amber px-6 py-3 text-sm font-semibold text-midnight-blue transition-all hover:bg-amber-400 glow-sm font-ui"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}