/**
 * CorbaTales Server Functions — API Integration
 * ==============================================
 * TanStack Start server functions for the AI pipeline.
 * 
 * Place this file at: src/lib/server/stories.ts
 * 
 * The Full-Stack Engineer should import these functions into their routes:
 *   import { generateStory, listStories, cloneVoice } from "~/lib/server/stories";
 */

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { 
  runFullPipeline, 
  cloneVoice as cloneVoicePipeline,
  generateStory as generateStoryPipeline,
  generateIllustration,
  generateNarration,
} from "~/lib/pipeline";
import { sql } from "~/db";

// ─── Schemas ────────────────────────────────────────────────────────────────

const generateStorySchema = z.object({
  childProfileId: z.string().uuid(),
  specialElement: z.string().max(100).optional(),
});

const listStoriesSchema = z.object({
  userId: z.string().uuid(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

const toggleFavoriteSchema = z.object({
  storyId: z.string().uuid(),
  isFavorite: z.boolean(),
});

const createChildProfileSchema = z.object({
  name: z.string().min(1).max(50),
  age: z.number().int().min(2).max(10),
  interests: z.array(z.string().min(1)).min(1).max(10),
  themes: z.array(z.string().min(1)).min(1).max(10),
  characters: z.array(z.string().min(1)).max(10).optional().default([]),
  settings: z.array(z.string().min(1)).max(10).optional().default([]),
  voiceId: z.string().optional(),
});

// ─── Story Endpoints ────────────────────────────────────────────────────────

/**
 * Generate a new bedtime story.
 * Calls the full AI pipeline: story gen → illustration → TTS narration.
 */
export const generateStory = createServerFn({ method: "POST" })
  .validator((data: unknown) => generateStorySchema.parse(data))
  .handler(async ({ data }) => {
    const { childProfileId, specialElement } = data;

    // 1. Load child profile from DB
    const profiles = await sql`
      SELECT id, name, age, interests, themes, characters, settings, voice_id
      FROM child_profiles
      WHERE id = ${childProfileId}
    `;
    if (profiles.length === 0) {
      throw new Error("Child profile not found");
    }
    const profile = profiles[0];

    // 2. Coerce non-primitive columns
    const childProfile = {
      id: profile.id,
      name: profile.name,
      age: profile.age,
      interests: JSON.parse(profile.interests),
      themes: JSON.parse(profile.themes),
      characters: profile.characters ? JSON.parse(profile.characters) : [],
      settings: profile.settings ? JSON.parse(profile.settings) : [],
      voiceId: profile.voice_id,
    };

    // 3. Run the AI pipeline
    const result = await runFullPipeline({
      childName: childProfile.name,
      age: childProfile.age,
      interests: childProfile.interests,
      themes: childProfile.themes,
      characters: childProfile.characters,
      setting: childProfile.settings?.[0],
      specialElement: specialElement,
      voiceId: childProfile.voiceId,
    });

    // 4. Save story to DB
    const saved = await sql`
      INSERT INTO stories (
        user_id, child_profile_id, title, story_text, 
        scene_descriptions, moral, word_count, 
        image_url, audio_url, generated_at
      ) VALUES (
        ${childProfile.userId}, ${childProfileId}, ${result.story.title},
        ${result.story.storyText}, ${JSON.stringify(result.story.sceneDescriptions)},
        ${result.story.moral}, ${result.story.wordCount},
        ${result.story.imageUrl ?? null}, ${result.story.audioUrl ?? null},
        NOW()
      )
      RETURNING id
    `;

    return {
      storyId: saved[0].id,
      ...result.story,
      cost: result.cost,
    };
  });

/**
 * List all stories for a user.
 */
export const listStories = createServerFn({ method: "GET" })
  .validator((data: unknown) => listStoriesSchema.parse(data))
  .handler(async ({ data }) => {
    const { userId, page, limit } = data;
    const offset = (page - 1) * limit;

    const rows = await sql`
      SELECT id, title, moral, image_url, generated_at, listened_count, is_favorite
      FROM stories
      WHERE user_id = ${userId}
      ORDER BY generated_at DESC
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    const total = await sql`
      SELECT COUNT(*) as count FROM stories WHERE user_id = ${userId}
    `;

    return {
      stories: rows.map((r: Record<string, unknown>) => ({
        id: r.id,
        title: r.title,
        moral: r.moral,
        imageUrl: r.image_url,
        generatedAt: String(r.generated_at),
        listenedCount: r.listened_count,
        isFavorite: Boolean(r.is_favorite),
      })),
      total: Number(total[0].count),
      page,
      limit,
    };
  });

/**
 * Get a single story by ID.
 */
export const getStory = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ storyId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const rows = await sql`
      SELECT id, title, story_text, scene_descriptions, moral, word_count,
             image_url, audio_url, generated_at, listened_count, is_favorite
      FROM stories
      WHERE id = ${data.storyId}
    `;
    if (rows.length === 0) {
      throw new Error("Story not found");
    }
    const r = rows[0];
    return {
      id: r.id,
      title: r.title,
      storyText: r.story_text,
      sceneDescriptions: JSON.parse(r.scene_descriptions),
      moral: r.moral,
      wordCount: r.word_count,
      imageUrl: r.image_url,
      audioUrl: r.audio_url,
      generatedAt: String(r.generated_at),
      listenedCount: r.listened_count,
      isFavorite: Boolean(r.is_favorite),
    };
  });

/**
 * Toggle favorite status on a story.
 */
export const toggleFavorite = createServerFn({ method: "POST" })
  .validator((data: unknown) => toggleFavoriteSchema.parse(data))
  .handler(async ({ data }) => {
    await sql`
      UPDATE stories SET is_favorite = ${data.isFavorite}
      WHERE id = ${data.storyId}
    `;
    return { storyId: data.storyId, isFavorite: data.isFavorite };
  });

/**
 * Increment the listened count for a story.
 */
export const incrementListened = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ storyId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    await sql`
      UPDATE stories SET listened_count = listened_count + 1
      WHERE id = ${data.storyId}
    `;
    return { storyId: data.storyId };
  });

/**
 * Re-generate audio narration for a story (e.g., if user wants to change voice).
 */
export const regenerateNarration = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ storyId: z.string().uuid(), voiceId: z.string() }).parse(data))
  .handler(async ({ data }) => {
    const rows = await sql`
      SELECT story_text FROM stories WHERE id = ${data.storyId}
    `;
    if (rows.length === 0) {
      throw new Error("Story not found");
    }

    const { audioBuffer } = await generateNarration(rows[0].story_text, data.voiceId);
    // TODO: Upload audioBuffer to CDN (S3/R2), get URL back
    const audioUrl = `https://cdn.corbatales.com/audio/${data.storyId}.mp3`;

    await sql`UPDATE stories SET audio_url = ${audioUrl} WHERE id = ${data.storyId}`;
    return { audioUrl };
  });

// ─── Voice Cloning Endpoints ────────────────────────────────────────────────

/**
 * Clone a parent's voice from an uploaded audio sample.
 */
export const cloneVoice = createServerFn({ method: "POST" })
  .validator((data: unknown) => 
    z.object({ 
      audioBase64: z.string(), 
      fileName: z.string(),
      voiceName: z.string().min(1).max(50),
      userId: z.string().uuid(),
    }).parse(data)
  )
  .handler(async ({ data }) => {
    // Convert base64 to ArrayBuffer
    const binaryStr = atob(data.audioBase64);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }

    // Call ElevenLabs voice cloning
    const { voiceId } = await cloneVoicePipeline({
      audioBuffer: bytes.buffer,
      fileName: data.fileName,
      voiceName: data.voiceName,
    });

    // Save voice ID to user profile
    await sql`
      INSERT INTO user_voices (user_id, elevenlabs_voice_id, voice_name)
      VALUES (${data.userId}, ${voiceId}, ${data.voiceName})
      ON CONFLICT (user_id) DO UPDATE SET
        elevenlabs_voice_id = EXCLUDED.elevenlabs_voice_id,
        voice_name = EXCLUDED.voice_name
    `;

    return { voiceId, status: "ready" };
  });

// ─── Child Profile Endpoints ────────────────────────────────────────────────

/**
 * Create or update a child profile.
 */
export const saveChildProfile = createServerFn({ method: "POST" })
  .validator((data: unknown) => createChildProfileSchema.parse(data))
  .handler(async ({ data }) => {
    // TODO: Get userId from auth context
    const userId = "current-user-id"; // Placeholder

    const result = await sql`
      INSERT INTO child_profiles (user_id, name, age, interests, themes, characters, settings, voice_id)
      VALUES (${userId}, ${data.name}, ${data.age}, 
              ${JSON.stringify(data.interests)}, ${JSON.stringify(data.themes)},
              ${JSON.stringify(data.characters)}, ${JSON.stringify(data.settings)},
              ${data.voiceId ?? null})
      ON CONFLICT (user_id, name) DO UPDATE SET
        age = EXCLUDED.age,
        interests = EXCLUDED.interests,
        themes = EXCLUDED.themes,
        characters = EXCLUDED.characters,
        settings = EXCLUDED.settings,
        voice_id = COALESCE(EXCLUDED.voice_id, child_profiles.voice_id)
      RETURNING id, name, age, interests, themes, characters, settings, created_at
    `;

    const r = result[0];
    return {
      id: r.id,
      name: r.name,
      age: r.age,
      interests: JSON.parse(r.interests),
      themes: JSON.parse(r.themes),
      characters: JSON.parse(r.characters),
      settings: JSON.parse(r.settings),
      createdAt: String(r.created_at),
    };
  });

/**
 * Get a child profile by ID.
 */
export const getChildProfile = createServerFn({ method: "GET" })
  .validator((data: unknown) => z.object({ profileId: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const rows = await sql`
      SELECT id, name, age, interests, themes, characters, settings, voice_id, created_at
      FROM child_profiles
      WHERE id = ${data.profileId}
    `;
    if (rows.length === 0) {
      throw new Error("Child profile not found");
    }
    const r = rows[0];
    return {
      id: r.id,
      name: r.name,
      age: r.age,
      interests: JSON.parse(r.interests),
      themes: JSON.parse(r.themes),
      characters: JSON.parse(r.characters),
      settings: JSON.parse(r.settings),
      voiceId: r.voice_id,
      createdAt: String(r.created_at),
    };
  });