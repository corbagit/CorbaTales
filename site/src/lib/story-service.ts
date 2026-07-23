/**
 * CorbaTales Story Service
 * Server functions that wrap the AI pipeline for use in the TanStack Start app.
 *
 * These functions run server-side only and are called from client components
 * via createServerFn().
 *
 * API Keys needed:
 *   OPENAI_API_KEY     — for story generation and illustration
 *   ELEVENLABS_API_KEY — for voice cloning and narration
 */
import { createServerFn } from "@tanstack/react-start";
import {
  runFullPipeline,
  cloneVoice,
  generateStory,
  generateNarration,
  generateIllustration,
  generateStorySchema,
  cloneVoiceSchema,
} from "~/lib/pipeline";
import type { StoryResult, CostBreakdown } from "~/lib/pipeline";

// ─── In-memory store (to be replaced with DB when connected) ────────────────
interface StoredStory extends StoryResult {
  id: string;
  userId: string;
  childName: string;
  age: number;
  interests: string[];
  themes: string[];
  createdAt: string;
}

const storyStore: StoredStory[] = [];
let storyIdCounter = 0;

// ─── 1. Generate a story ────────────────────────────────────────────────────

export const generateStoryForChild = createServerFn({ method: "POST" })
  .validator((data: {
    childName: string;
    age: number;
    interests: string[];
    themes: string[];
    characters?: string[];
    setting?: string;
    specialElement?: string;
    voiceId?: string;
    userId: string;
  }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await runFullPipeline({
        childName: data.childName,
        age: data.age,
        interests: data.interests,
        themes: data.themes,
        characters: data.characters,
        setting: data.setting,
        specialElement: data.specialElement,
        voiceId: data.voiceId,
      });

      const stored: StoredStory = {
        ...result.story,
        id: `story_${++storyIdCounter}`,
        userId: data.userId,
        childName: data.childName,
        age: data.age,
        interests: data.interests,
        themes: data.themes,
        createdAt: new Date().toISOString(),
      };

      storyStore.push(stored);

      return {
        story: stored,
        cost: result.cost,
      };
    } catch (error) {
      console.error("Story generation failed:", error);
      return {
        error: error instanceof Error ? error.message : "Story generation failed",
      };
    }
  });

// ─── 2. Clone voice ─────────────────────────────────────────────────────────

export const cloneUserVoice = createServerFn({ method: "POST" })
  .validator((data: { audioBase64: string; fileName: string; voiceName: string }) => data)
  .handler(async ({ data }) => {
    try {
      // Convert base64 to ArrayBuffer
      const binaryStr = atob(data.audioBase64);
      const bytes = new Uint8Array(binaryStr.length);
      for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }

      const result = await cloneVoice({
        audioBuffer: bytes.buffer as ArrayBuffer,
        fileName: data.fileName,
        voiceName: data.voiceName,
      });

      return {
        voiceId: result.voiceId,
        cost: result.cost,
      };
    } catch (error) {
      console.error("Voice cloning failed:", error);
      return {
        error: error instanceof Error ? error.message : "Voice cloning failed",
      };
    }
  });

// ─── 3. Generate narration ──────────────────────────────────────────────────

export const narrateStory = createServerFn({ method: "POST" })
  .validator((data: { storyText: string; voiceId: string }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await generateNarration(data.storyText, data.voiceId);
      // Convert ArrayBuffer to base64 for client transfer
      const bytes = new Uint8Array(result.audioBuffer);
      let binary = "";
      for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return {
        audioBase64: btoa(binary),
        cost: result.cost,
      };
    } catch (error) {
      console.error("Narration failed:", error);
      return {
        error: error instanceof Error ? error.message : "Narration generation failed",
      };
    }
  });

// ─── 4. Generate illustration only ──────────────────────────────────────────

export const createIllustration = createServerFn({ method: "POST" })
  .validator((data: { sceneDescription: string; age: number }) => data)
  .handler(async ({ data }) => {
    try {
      const result = await generateIllustration(
        data.sceneDescription,
        `${data.age - 1}-${data.age + 2}`,
      );
      return {
        imageUrl: result.imageUrl,
        cost: result.cost,
      };
    } catch (error) {
      console.error("Illustration failed:", error);
      return {
        error: error instanceof Error ? error.message : "Illustration generation failed",
      };
    }
  });

// ─── 5. Get stories (with optional userId filter) ──────────────────────────

export const getStories = createServerFn({ method: "GET" })
  .validator((data: { userId?: string; limit?: number }) => data)
  .handler(async ({ data }) => {
    let stories = storyStore;
    if (data.userId) {
      stories = stories.filter((s) => s.userId === data.userId);
    }
    // Sort by newest first
    stories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return stories.slice(0, data.limit || 50);
  });

// ─── 6. Get single story by ID ─────────────────────────────────────────────

export const getStoryById = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const story = storyStore.find((s) => s.id === data.id);
    if (!story) {
      return { error: "Story not found" };
    }
    return { story };
  });