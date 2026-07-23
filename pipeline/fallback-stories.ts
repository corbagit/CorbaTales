/**
 * CorbaTales Fallback Story Templates
 * =====================================
 * 5 sample stories with illustrations that can be served when APIs are
 * unavailable or rate-limited. Each story is a complete fallback with
 * title, story text, scene descriptions, moral, and illustration prompt.
 *
 * Import this in server functions:
 *   import { getFallbackStory } from "~/lib/fallback-stories";
 *   const story = getFallbackStory("luna", "space");
 */

import { StoryResult } from "~/lib/pipeline";

export interface FallbackStory {
  title: string;
  storyText: string;
  sceneDescriptions: string[];
  illustrationPrompt: string;
  moral: string;
  wordCount: number;
  suggestedAgeRange: [number, number];
  interests: string[];
}

// ─── 5 Fallback Stories ─────────────────────────────────────────────────────

const FALLBACK_STORIES: FallbackStory[] = [
  {
    title: "Luna and the Star-Seed Garden",
    storyText: `In a cozy little house nestled between rolling hills, there lived a curious five-year-old girl named Luna who loved dinosaurs and the stars more than anything in the world. Every night, she would look out her window and wonder if the dinosaurs who once ruled the Earth ever looked up at the very same stars.

One night, as Luna was drifting off to sleep, a tiny, glowing pebble floated through her window and landed softly on her blanket. It shimmered with colors she had never seen before — a warm golden light mixed with a gentle blue.

"Hello, Luna," said a soft, crinkly voice. From the pebble emerged a small dinosaur made of starlight, its scales sparkling like tiny constellations. "I am Orion, a Star-Seed Guardian. I have come to take you on a very special journey."

They floated up through the window, soaring past fluffy clouds and through a shimmering curtain of northern lights. They arrived at a magnificent garden floating among the stars, where flowers chimed like wind chimes and trees had leaves made of soft moonlight.

Luna planted a golden seed, and a brilliant beam of light shot up into the darkness. A brand-new star twinkled brightly in the sky.

"That star is special," Orion said. "It's a wishing star. Whenever you look up at it, remember that you can grow anything — kindness, courage, and dreams — just like we grow stars here."

And from that night on, Luna knew that even the biggest dreams start from the smallest seeds.`,
    sceneDescriptions: [
      "A cozy bedroom at night with a little girl looking out the window at a starry sky. A tiny glowing pebble floats through the window. Soft moonlight, warm colors.",
      "A stardust dinosaur made of constellations emerges from a glowing pebble, standing on a child's bed. Magical atmosphere with twinkling lights.",
      "A little girl and a stardust dinosaur floating through a shimmering curtain of northern lights. Stars and colorful aurora fill the sky.",
      "A magical floating garden among the stars, with glowing flowers that chime, trees with moonlit leaves, and tiny fairies tending to glowing seed pods.",
      "A little girl hugging a stardust dinosaur in a star-filled garden, with a single bright golden star shining above them. Warm, bedtime aesthetic.",
    ],
    illustrationPrompt: "Children's book illustration. A little girl in pajamas lies in bed, a tiny glowing golden pebble floating above her hand. Warm moonlight streams through the window. Cozy bedroom, stars outside. Soft golden and blue colors. Dreamy, magical atmosphere. Age 3-7.",
    moral: "Even the biggest dreams start from the smallest seeds — believe in the magic of kindness, courage, and imagination.",
    wordCount: 510,
    suggestedAgeRange: [3, 7],
    interests: ["space", "dinosaurs", "magic"],
  },
  {
    title: "The Brave Little Cloud",
    storyText: `High above the world, in a sky full of fluffy clouds, there lived a tiny cloud named Puff. While the other clouds were big and proud, rain-heavy and thunder-voiced, Puff was small and soft, barely bigger than a pillow.

"I wish I could do something important," Puff sighed to a passing bird.

"Every cloud has a special gift," chirped the bird. "You just haven't found yours yet."

One day, the sun was so hot that the flowers below began to wilt. The big clouds were too far away, and the wind was blowing the wrong way. But Puff drifted over the garden and stretched as thin as she could, casting a soft, cool shadow over the wilting flowers.

"Thank you, little cloud!" whispered the flowers, lifting their heads.

Puff realized she didn't need to be big or loud. She just needed to be where she was needed most. And from that day on, she floated with pride, knowing that even the smallest cloud can make a big difference.`,
    sceneDescriptions: [
      "A sky full of big, fluffy clouds with one tiny cloud among them. A small bird flies past. Bright, sunny day with blue sky.",
      "The tiny cloud looking down at a garden where flowers are wilting in the hot sun. The ground is dry and cracked.",
      "The tiny cloud stretching itself thin to cast a shadow over the garden. The flowers begin to lift their heads. Gentle, warm colors.",
      "The tiny cloud floating proudly among the other clouds, now with a gentle rainbow beneath it. The sun is setting in warm colors.",
    ],
    illustrationPrompt: "Children's book illustration. A tiny, cute cloud with a gentle face floats in a bright blue sky, casting a soft shadow over a garden of colorful flowers. Warm sunlight, gentle atmosphere. Soft watercolor style. Age 2-6.",
    moral: "You don't need to be big to make a difference — being kind and showing up is enough.",
    wordCount: 340,
    suggestedAgeRange: [2, 6],
    interests: ["animals", "magic", "adventure"],
  },
  {
    title: "Nova's Cosmic Journey",
    storyText: `Nova loved two things more than anything: dinosaurs and the stars. Every night, she would sit on her balcony with a telescope, gazing at the twinkling lights above.

"Where do stars go during the day?" she wondered.

A warm breeze rustled, and a tiny, shimmering figure appeared beside her. It was a Star Sprite — a glowing being made of pure light with wings like spun gold.

"Come with me," the Star Sprite whispered. "I'll show you where the stars hide."

They zipped across the sky, past the moon's craters, through a ring of colorful planets, and into a nebula that looked like a cotton candy dream. The stars were there, resting and playing, waiting for night to fall again.

Nova danced with the stars, collecting a handful of stardust in a tiny jar. When she returned home, the jar glowed softly on her nightstand.

"Now you can bring the stars with you wherever you go," said the Star Sprite, fading into the morning light.

And Nova knew that the universe was full of wonder — all she had to do was look up and believe.`,
    sceneDescriptions: [
      "A little girl on a balcony with a telescope, looking up at a star-filled night sky. The moon is bright. Warm, cozy atmosphere.",
      "A tiny glowing fairy-like being with golden wings appears beside the girl. Both are bathed in soft golden light.",
      "The girl and the sprite flying through space past colorful planets, rings, and a pink nebula. Stars twinkle around them.",
      "The girl back in her room, holding a glowing jar of stardust on her nightstand. Morning light streams through the window.",
    ],
    illustrationPrompt: "Children's book illustration. A little girl with a telescope on a balcony at night. A tiny glowing fairy-like being with golden wings appears beside her. Starry sky, warm moonlight. Magical, dreamy colors. Purple and gold palette. Age 4-8.",
    moral: "The universe is full of wonder — all you have to do is look up and believe.",
    wordCount: 380,
    suggestedAgeRange: [4, 8],
    interests: ["space", "magic", "adventure"],
  },
  {
    title: "The Whispering Forest",
    storyText: `When Leo moved to a new house in the countryside, he missed his old friends. The house was quiet, and the days felt long. But behind the garden, there was a forest — a forest that seemed to whisper his name.

One afternoon, Leo followed the whispering sound. The trees parted to reveal a clearing where fireflies danced in golden spirals and a gentle deer with a silver coat stood waiting.

"You are here," said the deer in a voice like wind chimes. "The forest has been waiting for you."

The deer showed Leo secret paths, talking streams, and a tree that grew cookies instead of fruit. They played hide-and-seek among the mushrooms and watched the sunset paint the sky in shades of pink and gold.

"You see," said the deer, "friendship doesn't need old friends — it needs an open heart."

Leo walked home with a pocket full of magic and a heart full of joy. He knew that every day held a new adventure, and he couldn't wait for tomorrow.`,
    sceneDescriptions: [
      "A boy standing at the edge of a mysterious forest, looking curious. The trees have a gentle glow. Evening light.",
      "A clearing in the forest with golden fireflies dancing in spirals. A beautiful deer with a silver coat stands waiting.",
      "The boy and the deer exploring a magical forest path with glowing mushrooms and a stream that sparkles. Warm, adventurous colors.",
      "The boy and the deer watching a pink and gold sunset over the forest. A cozy, warm scene.",
    ],
    illustrationPrompt: "Children's book illustration. A boy at the edge of a magical forest with glowing trees and fireflies. A gentle deer with a silver coat stands in a clearing. Warm golden light, mystical atmosphere. Age 3-7.",
    moral: "Friendship doesn't need old friends — it needs an open heart ready for new adventures.",
    wordCount: 360,
    suggestedAgeRange: [3, 7],
    interests: ["animals", "adventure", "magic"],
  },
  {
    title: "The Princess Who Built Robots",
    storyText: `Princess Amelia lived in a castle, but she didn't care for fancy dresses or royal balls. She cared about gears and circuits, springs and switches. Her workshop was her favorite room in the castle.

"Princesses don't build machines," said the royal advisor.

"Then I'll be a different kind of princess," Amelia replied.

She built a robot dragon that breathed glitter instead of fire, a mechanical bird that sang lullabies, and a clockwork cat that purred in perfect rhythm. Her inventions made everyone in the castle smile.

One day, a neighboring kingdom's prince came to visit. He was sad because his kingdom had no music. Amelia's mechanical bird sang for him, and the prince's face lit up with joy.

"Your inventions are magic," he said.

"Not magic," Amelia smiled. "Just hard work, curiosity, and believing that I can make a difference."

From that day on, the castle was filled with laughter, music, and the whirring of happy machines. And Princess Amelia became known as the most magical inventor in all the land.`,
    sceneDescriptions: [
      "A princess in a workshop surrounded by gears, tools, and machine parts. She wears a practical apron over her dress. Warm, cozy workshop atmosphere.",
      "The princess with her robot dragon that breathes glitter. The dragon is made of shiny metal with colorful gems. Sparkles everywhere.",
      "The princess presenting a mechanical bird to a visiting prince. The bird is singing, made of brass and copper. The prince looks delighted.",
      "The princess in her workshop at night, surrounded by her creations. Moonlight streams through a window. Warm, proud atmosphere.",
    ],
    illustrationPrompt: "Children's book illustration. A young princess with a wrench in her hand, standing in a workshop full of gears, robots, and inventions. A cute robot dragon made of shiny metal sits beside her. Warm, cozy, creative atmosphere. Age 5-9.",
    moral: "You can be any kind of princess, prince, or person you want to be — follow your curiosity and build your dreams.",
    wordCount: 410,
    suggestedAgeRange: [5, 9],
    interests: ["robots", "adventure", "princess"],
  },
];

// ─── Selection Functions ────────────────────────────────────────────────────

/**
 * Pick a fallback story based on child's interests. Matches by interest tags.
 * Falls back to a random story if no match.
 */
export function getFallbackStory(
  name: string,
  interests: string[],
): StoryResult & { illustrationPrompt: string } {
  // Find stories matching the child's interests
  const matching = FALLBACK_STORIES.filter((s) =>
    s.interests.some((i) => interests.map((x) => x.toLowerCase()).includes(i)),
  );

  // Pick from matching, or if none match, pick randomly
  const pool = matching.length > 0 ? matching : FALLBACK_STORIES;
  const story = pool[Math.floor(Math.random() * pool.length)];

  // Personalize the story with the child's name
  const personalized = story.storyText.replace(/Luna|Leo|Nova|Amelia|Puff/g, name);

  return {
    title: story.title,
    storyText: personalized,
    sceneDescriptions: story.sceneDescriptions,
    moral: story.moral,
    wordCount: story.wordCount,
    imageUrl: undefined,
    audioUrl: undefined,
    generatedAt: new Date().toISOString(),
    illustrationPrompt: story.illustrationPrompt,
  };
}

/**
 * Get a specific fallback by title.
 */
export function getFallbackByTitle(title: string): FallbackStory | undefined {
  return FALLBACK_STORIES.find(
    (s) => s.title.toLowerCase() === title.toLowerCase(),
  );
}

/**
 * Get all fallback stories (useful for testing or seeding).
 */
export function getAllFallbackStories(): FallbackStory[] {
  return [...FALLBACK_STORIES];
}

/**
 * Check if we should use fallback mode based on error type.
 */
export function shouldUseFallback(error: Error): boolean {
  const message = error.message.toLowerCase();
  return (
    message.includes("rate limit") ||
    message.includes("429") ||
    message.includes("quota") ||
    message.includes("insufficient_quota") ||
    message.includes("api key") ||
    message.includes("401") ||
    message.includes("402") ||
    message.includes("503") ||
    message.includes("timed out") ||
    message.includes("timeout") ||
    message.includes("network error")
  );
}

export default FALLBACK_STORIES;