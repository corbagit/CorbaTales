import { Link } from "@tanstack/react-router";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AuthGuard } from "~/components/AuthGuard";

export const Route = createFileRoute("/dashboard/library")({
  component: () => (
    <AuthGuard>
      <StoryLibrary />
    </AuthGuard>
  ),
});

function StoryLibrary() {
  const [filter, setFilter] = useState<"all" | "recent" | "favorites">("all");

  // Mock data — will be replaced with real data from the DB/API
  const stories = [
    { id: "1", title: "The Brave Little Star", date: "Tonight", child: "Leo", duration: "5 min", favorite: true, tags: ["adventure", "stars"] },
    { id: "2", title: "Luna and the Moonlit Garden", date: "Yesterday", child: "Leo", duration: "7 min", favorite: false, tags: ["nature", "magic"] },
    { id: "3", title: "Captain Whiskers' Ocean Adventure", date: "2 days ago", child: "Leo", duration: "6 min", favorite: true, tags: ["animals", "ocean"] },
    { id: "4", title: "The Dragon Who Loved to Dance", date: "3 days ago", child: "Leo", duration: "8 min", favorite: false, tags: ["dragons", "music"] },
    { id: "5", title: "Princess Sophie's Starry Night", date: "4 days ago", child: "Sophie", duration: "5 min", favorite: false, tags: ["princess", "stars"] },
    { id: "6", title: "The Tiny Gardener's Big Dream", date: "5 days ago", child: "Leo", duration: "6 min", favorite: false, tags: ["nature", "dreams"] },
  ];

  const filteredStories = filter === "favorites" ? stories.filter((s) => s.favorite) :
    filter === "recent" ? stories.slice(0, 3) : stories;

  return (
    <div className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/dashboard" className="hover:text-white">Dashboard</Link>
          <span>/</span>
          <span className="text-white">Story Library</span>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Story Library</h1>
            <p className="mt-2 text-gray-400">
              {stories.length} stories saved. Each one is a keepsake.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r bg-golden-amber px-5 py-2.5 text-sm font-semibold text-white transition-all hover:hover:bg-amber-400"
          >
            ✨ Generate New Story
          </Link>
        </div>

        {/* Filters */}
        <div className="mt-8 flex gap-2">
          {[
            { key: "all", label: "All Stories" },
            { key: "recent", label: "Recent" },
            { key: "favorites", label: "Favorites" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key as typeof filter)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                filter === f.key
                  ? "bg-golden-amber/20 text-amber-200 border border-golden-amber/30"
                  : "text-gray-400 hover:text-white border border-transparent"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Story grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="group rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:border-white/10 hover:bg-white/[0.04]"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="rounded-lg bg-golden-amber/10 p-2 text-xl">📖</div>
                <div className="flex gap-1">
                  {story.favorite && <span className="text-amber-400">⭐</span>}
                  <span className="text-xs text-gray-500">{story.date}</span>
                </div>
              </div>
              <h3 className="font-semibold text-white">{story.title}</h3>
              <p className="mt-1 text-xs text-gray-500">
                For {story.child} • {story.duration}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {story.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/5 px-2 py-0.5 text-xs text-gray-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-lg bg-gradient-to-r bg-golden-amber px-3 py-2 text-xs font-semibold text-white transition-all hover:hover:bg-amber-400">
                  ▶ Play
                </button>
                <button className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition-colors hover:bg-white/10">
                  📋 Read
                </button>
                <button className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-400 transition-colors hover:bg-white/10">
                  ⋮
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredStories.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-16 text-center">
            <div className="mb-4 text-5xl">📚</div>
            <h3 className="text-lg font-semibold text-white">No {filter} stories</h3>
            <p className="mt-2 text-sm text-gray-400">
              {filter === "favorites" ? "Tap the star on a story to add it to your favorites." : "Generate your first story to get started."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}