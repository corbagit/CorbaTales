import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useUser } from "@clerk/clerk-react";
import { useState } from "react";
import { AuthGuard } from "~/components/AuthGuard";

export const Route = createFileRoute("/dashboard/settings")({
  component: () => (
    <AuthGuard>
      <Settings />
    </AuthGuard>
  ),
});

function Settings() {
  const { user } = useUser();
  const [childName, setChildName] = useState("Leo");
  const [childAge, setChildAge] = useState("4");
  const [childInterest, setChildInterest] = useState("dinosaurs");
  const [theme, setTheme] = useState("adventure");
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Save to database
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
          <span>/</span>
          <span className="text-white">Settings</span>
        </div>

        <h1 className="text-3xl font-bold text-white">Child Preferences</h1>
        <p className="mt-2 text-gray-400">
          Customize the stories your child receives. These preferences help the AI
          create stories they'll love.
        </p>

        <form onSubmit={handleSave} className="mt-10 space-y-8">
          {/* Child Info */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">👶 About Your Child</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-300">Child's Name</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-golden-amber/50 focus:outline-none focus:ring-1 focus:ring-golden-amber/30"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300">Age</label>
                <select
                  value={childAge}
                  onChange={(e) => setChildAge(e.target.value)}
                  className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white transition-colors focus:border-golden-amber/50 focus:outline-none focus:ring-1 focus:ring-golden-amber/30"
                >
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((age) => (
                    <option key={age} value={age} className="bg-[#0F0B1E]">{age} years old</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Interests */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">🎯 Favorite Things</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300">Favorite animals, characters, or hobbies</label>
              <input
                type="text"
                value={childInterest}
                onChange={(e) => setChildInterest(e.target.value)}
                placeholder="e.g. dinosaurs, princesses, space, dragons"
                className="mt-1.5 block w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-golden-amber/50 focus:outline-none focus:ring-1 focus:ring-golden-amber/30"
              />
              <p className="mt-1.5 text-xs text-gray-500">Separate multiple interests with commas</p>
            </div>
          </div>

          {/* Story Preferences */}
          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">🌙 Story Preferences</h2>
            <div>
              <label className="block text-sm font-medium text-gray-300">Preferred Story Theme</label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  { value: "adventure", label: "Adventure", emoji: "🏔️" },
                  { value: "fantasy", label: "Fantasy & Magic", emoji: "🧙" },
                  { value: "nature", label: "Nature & Animals", emoji: "🌿" },
                  { value: "bedtime", label: "Gentle Bedtime", emoji: "🌙" },
                  { value: "educational", label: "Learning & Discovery", emoji: "🔬" },
                  { value: "friendship", label: "Friendship & Kindness", emoji: "💕" },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setTheme(option.value)}
                    className={`flex items-center gap-3 rounded-xl border p-4 text-left text-sm transition-all ${
                      theme === option.value
                        ? "border-golden-amber/30 bg-golden-amber/10 text-white"
                        : "border-white/5 bg-white/[0.02] text-gray-300 hover:border-white/10"
                    }`}
                  >
                    <span className="text-xl">{option.emoji}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Your preferences are used to personalize every story.
            </p>
            <button
              type="submit"
              className="rounded-xl bg-gradient-to-r bg-golden-amber px-6 py-3 text-sm font-semibold text-white transition-all hover:hover:bg-amber-400"
            >
              {saved ? "✅ Saved!" : "Save Preferences"}
            </button>
          </div>
        </form>

        {/* Voice recording section */}
        <div className="mt-12 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">🎤 Voice Recording</h2>
          <p className="text-sm text-gray-400">
            {user?.id
              ? "Your voice is on file. Every new story will be narrated in your voice."
              : "Record your voice to personalize story narration."}
          </p>
          <div className="mt-4 flex gap-3">
            <Link
              to="/dashboard/voice"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              {user?.id ? "Re-record Voice" : "Record Voice"}
            </Link>
          </div>
        </div>

        {/* Account info */}
        {user && (
          <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">👤 Account</h2>
            <div className="space-y-2 text-sm text-gray-400">
              <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
              <p>Name: {user.fullName || "Not set"}</p>
              <p>User ID: {user.id}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}