-- ============================================================================
-- CorbaTales Database Schema — Migration v1.0
-- ============================================================================
-- Target: Neon Serverless Postgres
-- Run:  psql $DATABASE_URL -f migration.sql
-- ============================================================================

-- ─── Extensions ─────────────────────────────────────────────────────────────

-- Enable UUID generation (needed for primary keys)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgcrypto for future encryption needs
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Users ──────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           TEXT UNIQUE NOT NULL,
    clerk_id        TEXT UNIQUE NOT NULL,              -- Clerk auth provider user ID
    name            TEXT NOT NULL,
    avatar_url      TEXT,                              -- Clerk avatar URL
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for Clerk auth lookup (most common query path)
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- ─── User Voices ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS user_voices (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    elevenlabs_voice_id TEXT NOT NULL,                 -- Voice model ID from ElevenLabs
    voice_name          TEXT NOT NULL,                 -- User-friendly name (e.g. "Mom's Voice")
    voice_sample_url    TEXT,                          -- URL to stored audio sample (for re-cloning)
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_voices_user_id ON user_voices(user_id);
CREATE INDEX IF NOT EXISTS idx_user_voices_elevenlabs_voice_id ON user_voices(elevenlabs_voice_id);

-- ─── Child Profiles ─────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS child_profiles (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    age             INTEGER NOT NULL CHECK (age >= 2 AND age <= 10),
    interests       TEXT[] NOT NULL DEFAULT '{}',      -- e.g. {'dinosaurs','space','animals'}
    themes          TEXT[] NOT NULL DEFAULT '{}',      -- e.g. {'magic','adventure','friendship'}
    characters      TEXT[] NOT NULL DEFAULT '{}',      -- e.g. {'rabbits','dragons'}
    settings        TEXT[] NOT NULL DEFAULT '{}',      -- e.g. {'forest','ocean','space'}
    voice_id        UUID REFERENCES user_voices(id) ON DELETE SET NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate child names per user
    UNIQUE(user_id, name)
);

CREATE INDEX IF NOT EXISTS idx_child_profiles_user_id ON child_profiles(user_id);

-- ─── Stories ────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS stories (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    child_profile_id    UUID REFERENCES child_profiles(id) ON DELETE SET NULL,

    -- Story content
    title               TEXT NOT NULL,
    story_text          TEXT NOT NULL,
    scene_descriptions  JSONB NOT NULL DEFAULT '[]',    -- Array of scene description strings
    moral               TEXT,                           -- The gentle lesson

    -- Metadata
    word_count          INTEGER NOT NULL DEFAULT 0,
    estimated_duration_seconds INTEGER NOT NULL DEFAULT 0,

    -- Media URLs
    image_url           TEXT,                           -- CDN URL for DALL-E 3 illustration
    audio_url           TEXT,                           -- CDN URL for ElevenLabs TTS audio

    -- Pipeline metadata (for cost tracking and debugging)
    pipeline_metadata   JSONB DEFAULT '{}',            -- {
                                                        --   "story_model": "gpt-4o-mini",
                                                        --   "story_tokens_in": 850,
                                                        --   "story_tokens_out": 700,
                                                        --   "story_cost": 0.001,
                                                        --   "image_model": "dall-e-3",
                                                        --   "image_cost": 0.04,
                                                        --   "tts_model": "eleven_turbo_v2_5",
                                                        --   "tts_chars": 2500,
                                                        --   "tts_cost": 0.08,
                                                        --   "voice_id": "abc123",
                                                        --   "generation_duration_ms": 8500,
                                                        --   "used_fallback": false
                                                        -- }

    -- Engagement tracking
    listened_count      INTEGER NOT NULL DEFAULT 0,
    is_favorite         BOOLEAN NOT NULL DEFAULT FALSE,

    -- Timestamps
    generated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_child_profile_id ON stories(child_profile_id);
CREATE INDEX IF NOT EXISTS idx_stories_generated_at ON stories(generated_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_is_favorite ON stories(user_id, is_favorite) WHERE is_favorite = TRUE;

-- Full-text search index for story content (optional, for future search feature)
CREATE INDEX IF NOT EXISTS idx_stories_search ON stories
    USING GIN (to_tsvector('english', title || ' ' || COALESCE(story_text, '')));

-- ─── Subscriptions ──────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS subscriptions (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    stripe_customer_id  TEXT UNIQUE,                   -- Stripe customer ID
    stripe_subscription_id TEXT UNIQUE,                -- Stripe subscription ID

    -- Plan details
    plan_type           TEXT NOT NULL CHECK (plan_type IN ('monthly', 'annual', 'gift_monthly', 'gift_annual')),
    status              TEXT NOT NULL DEFAULT 'inactive'
                        CHECK (status IN ('active', 'inactive', 'past_due', 'canceled', 'trialing')),

    -- Billing period
    current_period_start TIMESTAMPTZ,
    current_period_end   TIMESTAMPTZ,
    canceled_at          TIMESTAMPTZ,
    trial_ends_at        TIMESTAMPTZ,

    -- Story quota tracking
    stories_generated_this_period INTEGER NOT NULL DEFAULT 0,
    max_stories_per_period        INTEGER NOT NULL DEFAULT 30,     -- Default: 1/day

    -- Metadata
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_customer_id ON subscriptions(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- ─── Story Generation Logs (for monitoring & cost tracking) ─────────────────

CREATE TABLE IF NOT EXISTS generation_logs (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id             UUID REFERENCES users(id) ON DELETE SET NULL,
    story_id            UUID REFERENCES stories(id) ON DELETE SET NULL,
    child_profile_id    UUID REFERENCES child_profiles(id) ON DELETE SET NULL,

    -- Timing
    started_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at        TIMESTAMPTZ,
    total_duration_ms   INTEGER,

    -- Individual component results
    story_success       BOOLEAN NOT NULL DEFAULT FALSE,
    story_model         TEXT,
    story_tokens_in     INTEGER,
    story_tokens_out    INTEGER,
    story_cost          NUMERIC(10,6),
    story_error         TEXT,

    image_success       BOOLEAN NOT NULL DEFAULT FALSE,
    image_model         TEXT,
    image_cost          NUMERIC(10,6),
    image_error         TEXT,

    tts_success         BOOLEAN NOT NULL DEFAULT FALSE,
    tts_model           TEXT,
    tts_chars           INTEGER,
    tts_cost            NUMERIC(10,6),
    tts_error           TEXT,

    -- Overall
    used_fallback       BOOLEAN NOT NULL DEFAULT FALSE,
    fallback_story_title TEXT,
    total_cost          NUMERIC(10,6) NOT NULL DEFAULT 0,

    -- Error details
    error_type          TEXT,                          -- e.g. 'rate_limit', 'auth_error', 'network'
    error_message       TEXT,
    retry_count         INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_generation_logs_user_id ON generation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_completed_at ON generation_logs(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_generation_logs_success ON generation_logs(completed_at)
    WHERE story_success = FALSE OR image_success = FALSE OR tts_success = FALSE;

-- ─── Updated-at Trigger Function ────────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_voices_updated_at
    BEFORE UPDATE ON user_voices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_child_profiles_updated_at
    BEFORE UPDATE ON child_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ─── Row-Level Security (RLS) ───────────────────────────────────────────────
-- Enable RLS so users can only see their own data

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_voices ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_logs ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user ID from Clerk (set by application context)
-- In production, the app sets app.current_user_id before each query.
-- For development, this defaults to NULL (admin sees all).

-- Users policy: users can read their own row
CREATE POLICY users_self_access ON users
    FOR ALL USING (id = current_setting('app.current_user_id', TRUE)::UUID);

-- User voices policy
CREATE POLICY user_voices_self_access ON user_voices
    FOR ALL USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

-- Child profiles policy
CREATE POLICY child_profiles_self_access ON child_profiles
    FOR ALL USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

-- Stories policy
CREATE POLICY stories_self_access ON stories
    FOR ALL USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

-- Subscriptions policy
CREATE POLICY subscriptions_self_access ON subscriptions
    FOR ALL USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);

-- Generation logs policy (read-only for user's own logs)
CREATE POLICY generation_logs_self_access ON generation_logs
    FOR SELECT USING (user_id = current_setting('app.current_user_id', TRUE)::UUID);