/**
 * CorbaTales Interactive Story Demo Component
 * =============================================
 * Self-contained demo (no API keys needed) that shows:
 * 1. Child profile setup flow
 * 2. Sample generated story with mock illustration
 * 3. Narration simulation with play button
 *
 * Drop this into any page: <StoryDemo />
 */

import { useState, useEffect, useRef, useCallback } from "react";

// ─── Sample Stories ─────────────────────────────────────────────────────────

const SAMPLE_STORIES: Record<string, Array<{ title: string; story: string; moral: string; image: string }>> = {
  dinosaurs: [
    {
      title: "Daisy the Brave Little Dinosaur",
      story: "In a sunny valley where ferns grew as tall as trees, there lived a tiny dinosaur named Daisy. While other dinosaurs stomped and roared, Daisy was small and quiet. But when her friend Ptero the Pterodactyl got stuck in a sticky tar pit, it was Daisy's clever thinking — not size or strength — that saved the day. She used a long vine to pull her friend to safety, proving that the biggest hearts often come in the smallest packages.",
      moral: "Bravery comes in all sizes — you don't need to be the biggest to make a big difference.",
      image: "🦕",
    },
  ],
  space: [
    {
      title: "Nova's Nighttime Adventure",
      story: "Nova loved gazing at the stars from her bedroom window. One night, a friendly shooting star named Sparkle zipped down and invited her on a cosmic journey. They flew past swirling galaxies, danced with ringed planets, and collected moon dust in a tiny jar. When Nova returned home just before sunrise, she looked at the jar on her nightstand and smiled — knowing every night sky holds a new adventure.",
      moral: "The universe is full of wonder — all you have to do is look up and believe.",
      image: "🌟",
    },
  ],
  magic: [
    {
      title: "The Whispering Wardrobe",
      story: "When Leo discovered an old wardrobe in Grandma's attic, it didn't just hold coats — it whispered secrets of a magical forest where animals could talk. With a brave squirrel named Pip as his guide, Leo helped the forest creatures prepare for the Great Luminary Festival, where the oldest tree in the forest bloomed with glowing flowers. Leo learned that magic isn't about spells — it's about believing in the kindness around you.",
      moral: "True magic is found in helping others and believing in the impossible.",
      image: "✨",
    },
  ],
  animals: [
    {
      title: "Finn the Forgetful Fox",
      story: "Finn the fox kept forgetting where he buried his snacks. One day, he met Ollie the Owl, who taught him to make a map of his forest. As they drew the map together, Finn discovered hidden streams, cozy caves, and meadows full of berries. He never found all his old snacks, but he found something better — a whole forest of friends and new places to explore.",
      moral: "Sometimes getting lost is the best way to find something wonderful.",
      image: "🦊",
    },
  ],
  ocean: [
    {
      title: "Marina and the Singing Seashell",
      story: "Marina found a shimmering seashell on the beach that hummed a gentle tune whenever she held it to her ear. A tiny crab named Coral told her it was a Memory Shell, filled with songs from the ocean's heart. Marina returned it to the sea so its music could keep flowing, and ever after, whenever she visited the shore, the waves seemed to sing just for her.",
      moral: "The most precious treasures are the ones we share with the world.",
      image: "🐚",
    },
  ],
  knights: [
    {
      title: "Sir Wobble and the Giggle Dragon",
      story: "Sir Wobble was the clumsiest knight in the kingdom. He tripped over his sword and his armor clanked with every step. When a dragon named Giggle began causing chaos by laughing so hard that trees shook, Sir Wobble was sent to stop it. But instead of fighting, Sir Wobble told the dragon a funny joke — and soon they were both laughing so hard the whole kingdom joined in.",
      moral: "Kindness and humor can solve problems that strength never could.",
      image: "🐉",
    },
  ],
  princess: [
    {
      title: "Princess Amara's Starlight Crown",
      story: "Princess Amara didn't want a crown of gold and jewels. She wanted a crown made of starlight. So every night, she collected fallen stars from the castle garden. The more she shared her starlight with others — lighting the way for lost travelers, cheering up sad villagers — the brighter her crown became. She learned that true royalty isn't about what you wear, but how you light up the world around you.",
      moral: "The brightest crown is one woven from kindness to others.",
      image: "👑",
    },
  ],
  adventure: [
    {
      title: "The Map Behind the Painting",
      story: "While visiting Great-Aunt Mabel's house, Theo found a hidden map behind an old painting of a ship. It led to a secret garden behind a crumbling wall, filled with flowers that changed color with the wind. Theo and his aunt spent the afternoon planting new seeds and making up stories about the tiny fairies who must have lived there long ago.",
      moral: "Every old house has secrets — and every secret is an adventure waiting to happen.",
      image: "🗺️",
    },
  ],
  robots: [
    {
      title: "Bot-Bot and the Lost Battery",
      story: "Bot-Bot was a little robot with a big heart — literally, a big battery that powered his happy glow. When his battery ran low, he worried he wouldn't shine anymore. His friend Pixel the puppy showed him that even when his light dimmed, he could still wag his antenna, beep cheerful tunes, and help others. Bot-Bot learned that your light doesn't come from batteries — it comes from being a good friend.",
      moral: "Your inner light doesn't run on batteries — it runs on kindness and friendship.",
      image: "🤖",
    },
  ],
};

const ALL_INTERESTS = [
  { id: "dinosaurs", emoji: "🦕", label: "Dinosaurs" },
  { id: "space", emoji: "🌟", label: "Space & Stars" },
  { id: "magic", emoji: "✨", label: "Magic & Fantasy" },
  { id: "animals", emoji: "🦊", label: "Animals" },
  { id: "ocean", emoji: "🐚", label: "Ocean & Mermaids" },
  { id: "knights", emoji: "🐉", label: "Knights & Dragons" },
  { id: "princess", emoji: "👑", label: "Princesses" },
  { id: "adventure", emoji: "🗺️", label: "Adventure" },
  { id: "robots", emoji: "🤖", label: "Robots" },
];

// ─── Typewriter Effect ──────────────────────────────────────────────────────

function TypewriterText({ text, speed = 30 }: { text: string; speed?: number }) {
  const [displayed, setDisplayed] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setIsComplete(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span>
      {displayed}
      {!isComplete && <span className="animate-pulse text-golden-amber">▍</span>}
    </span>
  );
}

// ─── Magic Loader ───────────────────────────────────────────────────────────

function MagicLoader({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState(0);
  const messages = [
    "🧙‍♀️ Consulting the story wizard...",
    "📖 Weaving magical words together...",
    "🎨 Painting the illustrations...",
    "🎵 Warming up the narrator's voice...",
    "⭐ Adding a sprinkle of stardust...",
  ];

  useEffect(() => {
    if (phase >= messages.length) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setPhase(phase + 1), phase === 0 ? 800 : 1200);
    return () => clearTimeout(timer);
  }, [phase, onComplete, messages.length]);

  return (
    <div className="flex flex-col items-center gap-4 py-12">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-golden-amber/20 border-t-golden-amber" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl animate-pulse">
            {["🌟", "✨", "📖", "🎨", "⭐"][Math.min(phase, 4)]}
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-400 animate-pulse font-body">
        {messages[Math.min(phase, messages.length - 1)]}
      </p>
    </div>
  );
}

// ─── Narration Simulator ────────────────────────────────────────────────────

function NarrationBar({ isPlaying, onEnd }: { isPlaying: boolean; onEnd: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }
    const duration = 8000; // 8 seconds total
    const interval = 50;
    const step = (interval / duration) * 100;
    const timer = setInterval(() => {
      setProgress((p) => {
        const next = p + step;
        if (next >= 100) {
          clearInterval(timer);
          setTimeout(onEnd, 300);
          return 100;
        }
        return next;
      });
    }, interval);
    return () => clearInterval(timer);
  }, [isPlaying, onEnd]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((bar) => (
            <div
              key={bar}
              className="w-1 rounded-full bg-golden-amber/50"
              style={{
                height: `${[8, 12, 16, 12, 8][bar - 1]}px`,
                animation: isPlaying ? `pulse-glow ${0.4 + bar * 0.1}s ease-in-out infinite` : "none",
                animationDelay: `${bar * 0.1}s`,
              }}
            />
          ))}
        </div>
        <div className="flex-1">
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-golden-amber to-lavender-soft transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <span className="text-xs text-gray-500 font-ui">
          {Math.floor(progress / 10)}:{String(Math.floor((progress % 100) * 0.6)).padStart(2, "0")}
        </span>
      </div>
      {isPlaying && (
        <p className="mt-2 text-center text-xs text-gray-500 italic font-body">
          🎤 Narrated in your voice...
        </p>
      )}
    </div>
  );
}

// ─── Main StoryDemo Component ───────────────────────────────────────────────

export default function StoryDemo() {
  const [step, setStep] = useState<"profile" | "generating" | "story" | "narration">("profile");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [story, setStory] = useState<(typeof SAMPLE_STORIES)[string][number] | null>(null);
  const [isNarrating, setIsNarrating] = useState(false);
  const [showFullStory, setShowFullStory] = useState(false);
  const storyRef = useRef<HTMLDivElement>(null);

  const handleNarrationEnd = useCallback(() => {
    setIsNarrating(false);
    setStep("story");
    setShowFullStory(true);
  }, []);

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const generateStory = () => {
    if (!name.trim() || !age || selectedInterests.length === 0) return;
    setStep("generating");

    // Pick a story based on selected interests
    const interestKeys = Object.keys(SAMPLE_STORIES);
    const matchingKeys = selectedInterests.filter((i) => SAMPLE_STORIES[i]);
    const key = matchingKeys.length > 0
      ? matchingKeys[Math.floor(Math.random() * matchingKeys.length)]
      : interestKeys[Math.floor(Math.random() * interestKeys.length)];
    const stories = SAMPLE_STORIES[key];
    const selectedStory = stories[Math.floor(Math.random() * stories.length)];

    // In the real product, this would call the AI pipeline
    setTimeout(() => {
      setStory(selectedStory);
      setStep("narration");
      setIsNarrating(true);
    }, 5000);
  };

  const reset = () => {
    setStep("profile");
    setName("");
    setAge("");
    setSelectedInterests([]);
    setStory(null);
    setIsNarrating(false);
    setShowFullStory(false);
  };

  return (
    <div id="story-demo" className="scroll-mt-20">
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-golden-amber/20 bg-golden-amber/10 px-4 py-1.5 text-xs font-medium text-amber-200">
              🎭 Try It Yourself
            </span>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl font-heading">
              See a Story Come to Life
            </h2>
            <p className="mt-3 text-lg text-gray-400 font-body">
              Enter your child's details and watch as AI creates a personalized bedtime story
            </p>
          </div>

          <div className="mt-12 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.03] to-transparent p-6 sm:p-10">
            {/* ─── Step 1: Profile Setup ─── */}
            {step === "profile" && (
              <div className="space-y-8">
                {/* Name input */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300 font-ui">
                    Your Child's Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Luna"
                    maxLength={30}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-gray-600 transition-all focus:border-golden-amber/50 focus:outline-none focus:ring-2 focus:ring-golden-amber/20 font-body"
                  />
                </div>

                {/* Age selector */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300 font-ui">
                    Age
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((a) => (
                      <button
                        key={a}
                        onClick={() => setAge(String(a))}
                        className={`rounded-lg border px-4 py-2 text-sm transition-all font-ui ${
                          age === String(a)
                            ? "border-golden-amber bg-golden-amber/10 text-golden-amber"
                            : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {a} {a === 1 ? "year" : "years"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-300 font-ui">
                    What does {name || "your child"} love? <span className="text-gray-500 font-normal">(pick 1-3)</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {ALL_INTERESTS.map((interest) => (
                      <button
                        key={interest.id}
                        onClick={() => toggleInterest(interest.id)}
                        disabled={!selectedInterests.includes(interest.id) && selectedInterests.length >= 3}
                        className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm transition-all font-body ${
                          selectedInterests.includes(interest.id)
                            ? "border-golden-amber bg-golden-amber/10 text-white"
                            : selectedInterests.length >= 3
                              ? "border-white/5 text-gray-600 cursor-not-allowed"
                              : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        <span className="text-lg">{interest.emoji}</span>
                        {interest.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Generate button */}
                <button
                  onClick={generateStory}
                  disabled={!name.trim() || !age || selectedInterests.length === 0}
                  className="group relative mx-auto flex w-full items-center justify-center gap-2 rounded-xl bg-golden-amber px-8 py-4 text-base font-semibold text-midnight-blue transition-all hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-golden-amber animate-pulse-glow font-ui"
                >
                  ✨ Generate Your Demo Story
                  <svg className="h-5 w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            )}

            {/* ─── Step 2: Generating ─── */}
            {step === "generating" && (
              <MagicLoader onComplete={() => {}} />
            )}

            {/* ─── Step 3: Narration ─── */}
            {step === "narration" && story && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 font-body">✨ Your story is ready!</p>
                  <p className="mt-1 text-xs text-gray-600 font-body">Listen to a preview...</p>
                </div>
                <NarrationBar isPlaying={isNarrating} onEnd={handleNarrationEnd} />
              </div>
            )}

            {/* ─── Step 4: Story Display ─── */}
            {(step === "story" || (step === "narration" && story)) && story && (
              <div ref={storyRef} className={`space-y-8 transition-all ${step === "story" ? "opacity-100" : "opacity-0"}`}>
                {/* Illustration + Title */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
                  <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-golden-amber/20 to-lavender-soft/20 text-5xl border border-white/10">
                    {story.image}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white sm:text-2xl font-heading">{story.title}</h3>
                    <p className="mt-1 text-sm text-golden-amber font-body">
                      A story for {name || "your child"}, age {age || "5"}
                    </p>
                  </div>
                </div>

                {/* Story text */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-6">
                  {showFullStory ? (
                    <p className="leading-relaxed text-gray-300 font-body">{story.story}</p>
                  ) : (
                    <p className="leading-relaxed text-gray-300 font-body">
                      <TypewriterText text={story.story} speed={20} />
                    </p>
                  )}
                </div>

                {/* Moral */}
                <div className="rounded-xl border border-golden-amber/10 bg-golden-amber/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-golden-amber font-ui">
                        Tonight's Lesson
                      </p>
                      <p className="mt-1 text-sm italic text-gray-300 font-body">"{story.moral}"</p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                  <button
                    onClick={() => {
                      setIsNarrating(true);
                      setShowFullStory(false);
                      setStep("narration");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-golden-amber px-6 py-3 text-sm font-semibold text-midnight-blue transition-all hover:bg-amber-400 font-ui"
                  >
                    🔁 Hear It Again
                  </button>
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-white/10 font-ui"
                  >
                    🔄 Start Over
                  </button>
                  <a
                    href="/signup"
                    className="inline-flex items-center gap-2 rounded-xl border border-lavender-soft/20 bg-lavender-soft/10 px-6 py-3 text-sm font-semibold text-lavender-soft transition-all hover:bg-lavender-soft/20 font-ui"
                  >
                    ✨ Get Stories in Your Voice
                  </a>
                </div>

                {/* Real pipeline note */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-center text-xs text-gray-600 font-body">
                    ⚡ This is a demo preview. The real CorbaTales generates unique stories with your voice, 
                    custom illustrations, and full narration — every night.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export { SAMPLE_STORIES, ALL_INTERESTS };