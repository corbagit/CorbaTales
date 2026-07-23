/**
 * CorbaTales AI Pipeline — TypeScript API Module
 * ================================================
 * Server-side API module for the TanStack Start website.
 * Handles story generation, voice cloning, illustration, and TTS.
 *
 * Integration: Import into server functions via createServerFn().
 *
 * Usage:
 *   import { generateStory, cloneVoice } from "~/lib/pipeline";
 *
 *   const story = await generateStory({
 *     childName: "Luna",
 *     age: 5,
 *     interests: ["dinosaurs", "space"],
 *     themes: ["magic", "adventure"],
 *   });
 */

import { z } from "zod";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ChildProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  interests: string[];
  themes: string[];
  characters: string[];
  settings: string[];
  createdAt: Date;
}

export interface StoryResult {
  title: string;
  storyText: string;
  sceneDescriptions: string[];
  moral: string;
  wordCount: number;
  imageUrl?: string;
  audioUrl?: string;
  generatedAt: string;
}

export interface CostBreakdown {
  storyGeneration: number;
  illustration: number;
  tts: number;
  total: number;
}

export interface GenerateStoryInput {
  childName: string;
  age: number;
  interests: string[];
  themes: string[];
  characters?: string[];
  setting?: string;
  specialElement?: string;
  voiceId?: string;
}

// ─── Configuration ──────────────────────────────────────────────────────────

const config = {
  openai: {
    apiKey: () => process.env.OPENAI_API_KEY ?? "",
    storyModel: "gpt-4o-mini",
    imageModel: "dall-e-3",
    imageSize: "1024x1024" as const,
    imageQuality: "standard" as const,
    imageStyle: "vivid" as const,
  },
  elevenlabs: {
    apiKey: () => process.env.ELEVENLABS_API_KEY ?? "",
    voiceModel: "eleven_turbo_v2_5",
  },
};

// ─── Cost Constants ─────────────────────────────────────────────────────────

const COSTS = {
  GPT_4O_MINI_INPUT: 0.15 / 1_000_000,   // $0.15 per 1M input tokens
  GPT_4O_MINI_OUTPUT: 0.60 / 1_000_000,  // $0.60 per 1M output tokens
  DALL_E_3_STANDARD: 0.04,               // $0.04 per 1024x1024 image
  ELEVENLABS_TURBO: 0.08 / 1000,          // $0.08 per 1K characters
};

// ─── OpenAI API Client ──────────────────────────────────────────────────────

async function callOpenAI(body: Record<string, unknown>, endpoint: string) {
  const apiKey = config.openai.apiKey();
  if (!apiKey) throw new Error("OPENAI_API_KEY is not set");

  const response = await fetch(`https://api.openai.com/v1/${endpoint}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${error}`);
  }

  return response.json();
}

// ─── ElevenLabs API Client ──────────────────────────────────────────────────

async function callElevenLabs(
  path: string,
  options: { method?: string; body?: BodyInit; headers?: Record<string, string> } = {},
) {
  const apiKey = config.elevenlabs.apiKey();
  if (!apiKey) throw new Error("ELEVENLABS_API_KEY is not set");

  const response = await fetch(`https://api.elevenlabs.io/v1${path}`, {
    method: options.method ?? "POST",
    headers: {
      "xi-api-key": apiKey,
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`ElevenLabs API error (${response.status}): ${error}`);
  }

  return response;
}

// ─── 1. Voice Cloning ───────────────────────────────────────────────────────

export interface CloneVoiceInput {
  audioBuffer: ArrayBuffer;
  fileName: string;
  voiceName: string;
}

export interface CloneVoiceResult {
  voiceId: string;
  voiceName: string;
}

/**
 * Clone a voice from a 3-minute audio sample using ElevenLabs.
 * The audio should be a 16-bit, 44.1kHz, mono WAV or MP3.
 */
export async function cloneVoice(input: CloneVoiceInput): Promise<CloneVoiceResult> {
  const formData = new FormData();
  const blob = new Blob([input.audioBuffer], { type: "audio/mpeg" });
  formData.append("files", blob, input.fileName);
  formData.append("name", input.voiceName);
  formData.append("labels", JSON.stringify({ source: "corba-recording", type: "parent" }));
  formData.append("description", "Voice cloned for CorbaTales bedtime stories");

  const response = await callElevenLabs("/voices/add", {
    method: "POST",
    body: formData,
    headers: {}, // Let fetch set Content-Type for FormData
  });

  const data = await response.json() as { voice_id: string };
  return { voiceId: data.voice_id, voiceName: input.voiceName };
}

// ─── 2. Story Generation ────────────────────────────────────────────────────

/**
 * Generate a personalized bedtime story using GPT-4o mini.
 */
export async function generateStory(input: GenerateStoryInput): Promise<{
  story: StoryResult;
  cost: CostBreakdown;
}> {
  const { childName, age, interests, themes, characters, setting, specialElement } = input;

  // Age-appropriate writing style
  const writingStyle = age <= 3
    ? "simple, repetitive, soothing, very short sentences"
    : age <= 6
      ? "descriptive but accessible, warm vocabulary"
      : "rich vocabulary, more complex plot, engaging dialogue";

  const wordTarget = age <= 3 ? "200-300 words" : age <= 6 ? "300-500 words" : "500-800 words";

  const systemPrompt = `You are CorbaTales, an AI bedtime story generator for children ages 2-10.
You create unique, warm, and engaging stories that are:
- Age-appropriate (vocabulary, themes, length)
- Positive and uplifting (gentle lessons, happy endings)
- Imaginative but coherent
- Culturally inclusive and diverse

Rules:
- Stories must be ${wordTarget}
- Always include a gentle moral or lesson
- Create 3-5 scene descriptions for illustration prompts
- Never include scary or violent content
- The protagonist should be relatable to the child
- Use warm, descriptive language
- Output in JSON format only, no markdown fences`;

  const userPrompt = `Generate a unique bedtime story with these details:

Child's name: ${childName}
Age: ${age}
Interests: ${interests.join(", ")}
Favorite themes: ${themes.join(", ")}
Favorite characters/animals: ${characters?.join(", ") || "Any friendly animal"}
Setting preference: ${setting || "A cozy magical world"}
Today's special element: ${specialElement || "A gentle surprise"}

Writing style: ${writingStyle}
Target length: ${wordTarget}

Output ONLY valid JSON (no markdown, no code fences):
{
  "title": "The story title",
  "story_text": "Full story text...",
  "scene_descriptions": [
    "Description of scene 1 for illustration",
    "Description of scene 2 for illustration",
    "Description of scene 3 for illustration"
  ],
  "moral": "The gentle lesson of the story",
  "word_count": 523
}`;

  const data = await callOpenAI({
    model: config.openai.storyModel,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    temperature: 0.85,
    max_tokens: 2000,
    response_format: { type: "json_object" },
  }, "chat/completions");

  // Calculate cost
  const usage = data.usage as { prompt_tokens: number; completion_tokens: number };
  const storyCost = (usage.prompt_tokens * COSTS.GPT_4O_MINI_INPUT) +
    (usage.completion_tokens * COSTS.GPT_4O_MINI_OUTPUT);

  const content = data.choices[0].message.content as string;
  const parsed = JSON.parse(content) as {
    title: string;
    story_text: string;
    scene_descriptions: string[];
    moral: string;
    word_count: number;
  };

  return {
    story: {
      title: parsed.title,
      storyText: parsed.story_text,
      sceneDescriptions: parsed.scene_descriptions,
      moral: parsed.moral,
      wordCount: parsed.word_count,
      generatedAt: new Date().toISOString(),
    },
    cost: {
      storyGeneration: Math.round(storyCost * 10000) / 10000,
      illustration: 0,
      tts: 0,
      total: Math.round(storyCost * 10000) / 10000,
    },
  };
}

// ─── 3. Illustration Generation ─────────────────────────────────────────────

/**
 * Generate an illustration for a story scene using DALL-E 3.
 */
export async function generateIllustration(
  sceneDescription: string,
  ageRange?: string,
): Promise<{ imageUrl: string; cost: number }> {
  const prompt = `Children's book illustration style. ${sceneDescription}. Warm, soft colors. Friendly characters. Age-appropriate for children ${ageRange ?? "4-8"}. Digital illustration style, cozy bedtime aesthetic. No text in the image.`;

  const data = await callOpenAI({
    model: config.openai.imageModel,
    prompt,
    n: 1,
    size: config.openai.imageSize,
    quality: config.openai.imageQuality,
    style: config.openai.imageStyle,
  }, "images/generations");

  return {
    imageUrl: data.data[0].url as string,
    cost: COSTS.DALL_E_3_STANDARD,
  };
}

// ─── 4. Text-to-Speech ──────────────────────────────────────────────────────

/**
 * Convert story text to speech using ElevenLabs with a cloned voice.
 * Returns the audio as an ArrayBuffer.
 */
export async function generateNarration(
  storyText: string,
  voiceId: string,
): Promise<{ audioBuffer: ArrayBuffer; cost: number }> {
  const response = await callElevenLabs(`/text-to-speech/${voiceId}`, {
    body: JSON.stringify({
      text: storyText,
      model_id: config.elevenlabs.voiceModel,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
        style: 0.3,
        use_speaker_boost: true,
      },
    }),
  });

  const audioBuffer = await response.arrayBuffer();
  const charCount = storyText.length;
  const cost = charCount * COSTS.ELEVENLABS_TURBO;

  return { audioBuffer, cost: Math.round(cost * 10000) / 10000 };
}

// ─── 5. Full Pipeline ───────────────────────────────────────────────────────

export interface FullPipelineInput extends GenerateStoryInput {
  voiceId?: string;
}

export interface FullPipelineResult {
  story: StoryResult;
  cost: CostBreakdown;
}

/**
 * Run the complete pipeline: generate story → illustration → narration.
 * Returns the story with image and audio URLs.
 */
export async function runFullPipeline(input: FullPipelineInput): Promise<FullPipelineResult> {
  const costs: CostBreakdown = { storyGeneration: 0, illustration: 0, tts: 0, total: 0 };

  // Step 1: Generate story
  const { story, cost: storyCost } = await generateStory(input);
  costs.storyGeneration = storyCost.storyGeneration;
  costs.total += storyCost.storyGeneration;

  // Step 2: Generate illustration (for the first scene)
  if (story.sceneDescriptions.length > 0) {
    try {
      const { imageUrl, cost: imageCost } = await generateIllustration(
        story.sceneDescriptions[0],
        `${input.age - 1}-${input.age + 2}`,
      );
      story.imageUrl = imageUrl;
      costs.illustration = imageCost;
      costs.total += imageCost;
    } catch (error) {
      console.warn("Illustration generation failed, continuing without image:", error);
    }
  }

  // Step 3: Generate narration
  if (input.voiceId) {
    try {
      const { audioBuffer, cost: ttsCost } = await generateNarration(
        story.storyText,
        input.voiceId,
      );
      // Store audio buffer (e.g., upload to S3/R2, get URL back)
      // For now, we just track the cost
      costs.tts = ttsCost;
      costs.total += ttsCost;
    } catch (error) {
      console.warn("Narration generation failed, continuing without audio:", error);
    }
  }

  return { story, cost: costs };
}

// ─── Validation Schemas ─────────────────────────────────────────────────────

export const generateStorySchema = z.object({
  childName: z.string().min(1).max(50),
  age: z.number().int().min(2).max(10),
  interests: z.array(z.string().min(1)).min(1).max(10),
  themes: z.array(z.string().min(1)).min(1).max(10),
  characters: z.array(z.string().min(1)).max(10).optional(),
  setting: z.string().max(100).optional(),
  specialElement: z.string().max(100).optional(),
  voiceId: z.string().optional(),
});

export const cloneVoiceSchema = z.object({
  voiceName: z.string().min(1).max(50),
});