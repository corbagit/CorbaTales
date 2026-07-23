/**
 * CorbaTales Database Schema — TypeScript Interfaces
 * ====================================================
 * Typed interfaces matching the migration SQL schema.
 * Use these with the `sql` helper from `~/db.ts` for type-safe queries.
 *
 * Import anywhere:
 *   import { User, Story, ChildProfile } from "~/lib/schema";
 *
 * Note: Neon returns timestamps as JS Date objects and arrays as
 * comma-separated strings. Coerce them properly before returning to
 * the client (React won't render Date or raw array objects).
 */

// ─── Users ──────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  clerkId: string;
  name: string;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

/** User record as returned from raw SQL (column names as they are in the DB) */
export interface UserRow {
  id: string;
  email: string;
  clerk_id: string;
  name: string;
  avatar_url: string | null;
  created_at: Date;
  updated_at: Date;
}

// ─── User Voices ────────────────────────────────────────────────────────────

export interface UserVoice {
  id: string;
  userId: string;
  elevenlabsVoiceId: string;
  voiceName: string;
  voiceSampleUrl?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserVoiceRow {
  id: string;
  user_id: string;
  elevenlabs_voice_id: string;
  voice_name: string;
  voice_sample_url: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ─── Child Profiles ─────────────────────────────────────────────────────────

export interface ChildProfile {
  id: string;
  userId: string;
  name: string;
  age: number;
  interests: string[];
  themes: string[];
  characters: string[];
  settings: string[];
  voiceId?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChildProfileRow {
  id: string;
  user_id: string;
  name: string;
  age: number;
  interests: string;       // Postgres array → parse with JSON.parse or split
  themes: string;
  characters: string;
  settings: string;
  voice_id: string | null;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// ─── Stories ────────────────────────────────────────────────────────────────

export interface Story {
  id: string;
  userId: string;
  childProfileId?: string | null;
  title: string;
  storyText: string;
  sceneDescriptions: string[];
  moral?: string | null;
  wordCount: number;
  estimatedDurationSeconds: number;
  imageUrl?: string | null;
  audioUrl?: string | null;
  pipelineMetadata: PipelineMetadata;
  listenedCount: number;
  isFavorite: boolean;
  generatedAt: Date;
  createdAt: Date;
}

export interface StoryRow {
  id: string;
  user_id: string;
  child_profile_id: string | null;
  title: string;
  story_text: string;
  scene_descriptions: string;     // JSONB → parse with JSON.parse
  moral: string | null;
  word_count: number;
  estimated_duration_seconds: number;
  image_url: string | null;
  audio_url: string | null;
  pipeline_metadata: string;       // JSONB → parse with JSON.parse
  listened_count: number;
  is_favorite: boolean;
  generated_at: Date;
  created_at: Date;
}

// ─── Pipeline Metadata (stored as JSONB in stories.pipeline_metadata) ───────

export interface PipelineMetadata {
  storyModel?: string;
  storyTokensIn?: number;
  storyTokensOut?: number;
  storyCost?: number;
  imageModel?: string;
  imageCost?: number;
  ttsModel?: string;
  ttsChars?: number;
  ttsCost?: number;
  voiceId?: string;
  generationDurationMs?: number;
  usedFallback?: boolean;
  fallbackStoryTitle?: string;
}

// ─── Subscriptions ──────────────────────────────────────────────────────────

export type PlanType = 'monthly' | 'annual' | 'gift_monthly' | 'gift_annual';
export type SubscriptionStatus = 'active' | 'inactive' | 'past_due' | 'canceled' | 'trialing';

export interface Subscription {
  id: string;
  userId: string;
  stripeCustomerId?: string | null;
  stripeSubscriptionId?: string | null;
  planType: PlanType;
  status: SubscriptionStatus;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  canceledAt?: Date | null;
  trialEndsAt?: Date | null;
  storiesGeneratedThisPeriod: number;
  maxStoriesPerPeriod: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionRow {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_type: PlanType;
  status: SubscriptionStatus;
  current_period_start: Date | null;
  current_period_end: Date | null;
  canceled_at: Date | null;
  trial_ends_at: Date | null;
  stories_generated_this_period: number;
  max_stories_per_period: number;
  created_at: Date;
  updated_at: Date;
}

// ─── Generation Logs ────────────────────────────────────────────────────────

export interface GenerationLog {
  id: string;
  userId?: string | null;
  storyId?: string | null;
  childProfileId?: string | null;
  startedAt: Date;
  completedAt?: Date | null;
  totalDurationMs?: number | null;
  storySuccess: boolean;
  storyModel?: string | null;
  storyTokensIn?: number | null;
  storyTokensOut?: number | null;
  storyCost?: number | null;
  storyError?: string | null;
  imageSuccess: boolean;
  imageModel?: string | null;
  imageCost?: number | null;
  imageError?: string | null;
  ttsSuccess: boolean;
  ttsModel?: string | null;
  ttsChars?: number | null;
  ttsCost?: number | null;
  ttsError?: string | null;
  usedFallback: boolean;
  fallbackStoryTitle?: string | null;
  totalCost: number;
  errorType?: string | null;
  errorMessage?: string | null;
  retryCount: number;
}

export interface GenerationLogRow {
  id: string;
  user_id: string | null;
  story_id: string | null;
  child_profile_id: string | null;
  started_at: Date;
  completed_at: Date | null;
  total_duration_ms: number | null;
  story_success: boolean;
  story_model: string | null;
  story_tokens_in: number | null;
  story_tokens_out: number | null;
  story_cost: number | null;
  story_error: string | null;
  image_success: boolean;
  image_model: string | null;
  image_cost: number | null;
  image_error: string | null;
  tts_success: boolean;
  tts_model: string | null;
  tts_chars: number | null;
  tts_cost: number | null;
  tts_error: string | null;
  used_fallback: boolean;
  fallback_story_title: string | null;
  total_cost: number;
  error_type: string | null;
  error_message: string | null;
  retry_count: number;
}

// ─── Row → Interface Coercion Helpers ───────────────────────────────────────

/**
 * Convert a raw UserRow (snake_case, Date objects) to a clean User interface
 * suitable for returning to React components.
 */
export function toUser(row: UserRow): User {
  return {
    id: row.id,
    email: row.email,
    clerkId: row.clerk_id,
    name: row.name,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert a raw StoryRow to a clean Story interface.
 */
export function toStory(row: StoryRow): Story {
  return {
    id: row.id,
    userId: row.user_id,
    childProfileId: row.child_profile_id,
    title: row.title,
    storyText: row.story_text,
    sceneDescriptions: safeJsonParse(row.scene_descriptions, []),
    moral: row.moral,
    wordCount: row.word_count,
    estimatedDurationSeconds: row.estimated_duration_seconds,
    imageUrl: row.image_url,
    audioUrl: row.audio_url,
    pipelineMetadata: safeJsonParse(row.pipeline_metadata, {}),
    listenedCount: row.listened_count,
    isFavorite: row.is_favorite,
    generatedAt: row.generated_at,
    createdAt: row.created_at,
  };
}

/**
 * Convert a raw ChildProfileRow to a clean ChildProfile interface.
 * Handles Postgres array strings like "{dinosaurs,space,animals}".
 */
export function toChildProfile(row: ChildProfileRow): ChildProfile {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    age: row.age,
    interests: parsePostgresArray(row.interests),
    themes: parsePostgresArray(row.themes),
    characters: parsePostgresArray(row.characters),
    settings: parsePostgresArray(row.settings),
    voiceId: row.voice_id,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

/**
 * Convert a raw SubscriptionRow to a clean Subscription interface.
 */
export function toSubscription(row: SubscriptionRow): Subscription {
  return {
    id: row.id,
    userId: row.user_id,
    stripeCustomerId: row.stripe_customer_id,
    stripeSubscriptionId: row.stripe_subscription_id,
    planType: row.plan_type,
    status: row.status,
    currentPeriodStart: row.current_period_start,
    currentPeriodEnd: row.current_period_end,
    canceledAt: row.canceled_at,
    trialEndsAt: row.trial_ends_at,
    storiesGeneratedThisPeriod: row.stories_generated_this_period,
    maxStoriesPerPeriod: row.max_stories_per_period,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ─── Utility Helpers ────────────────────────────────────────────────────────

/**
 * Safely parse a JSON string, returning the fallback on failure.
 */
function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T;
  } catch {
    return fallback;
  }
}

/**
 * Parse a Postgres text array (e.g. "{dinosaurs,space,animals}") into a
 * JavaScript string array.
 */
function parsePostgresArray(str: string): string[] {
  if (!str || str === '{}') return [];
  return str
    .replace(/[{}"]/g, '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Convert a JavaScript string array to a Postgres array literal
 * (e.g. ["dinosaurs", "space"] → '{"dinosaurs","space"}').
 * Use in INSERT/UPDATE queries.
 */
export function toPostgresArray(arr: string[]): string {
  if (arr.length === 0) return '{}';
  return `{${arr.map((s) => `"${s.replace(/"/g, '\\"')}"`).join(',')}}`;
}

// ─── Query Parameter Types ──────────────────────────────────────────────────

export interface ListStoriesParams {
  userId: string;
  page?: number;
  limit?: number;
  favoriteOnly?: boolean;
  childProfileId?: string;
}

export interface CreateStoryParams {
  userId: string;
  childProfileId?: string;
  title: string;
  storyText: string;
  sceneDescriptions: string[];
  moral?: string;
  wordCount: number;
  imageUrl?: string;
  audioUrl?: string;
  pipelineMetadata?: PipelineMetadata;
}

export interface CreateChildProfileParams {
  userId: string;
  name: string;
  age: number;
  interests: string[];
  themes: string[];
  characters?: string[];
  settings?: string[];
  voiceId?: string;
}

export interface CreateUserVoiceParams {
  userId: string;
  elevenlabsVoiceId: string;
  voiceName: string;
  voiceSampleUrl?: string;
}

export interface CreateSubscriptionParams {
  userId: string;
  planType: PlanType;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
}