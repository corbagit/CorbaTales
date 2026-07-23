# CorbaTales Database

Neon Serverless Postgres database for the CorbaTales application.

## Files

| File | Description |
|------|-------------|
| `migration.sql` | Full schema with CREATE TABLE statements, indexes, triggers, and RLS policies |
| `schema.ts` | TypeScript typed interfaces with row→interface coercion helpers |
| `seed.sql` | Realistic sample data (3 users, 3 subscriptions, 3 voices, 4 children, 5 stories, 4 logs) |

## Schema Overview

```
users ────┬── user_voices ──────── (1:1, ElevenLabs voice model)
          ├── child_profiles ───── (1:N, one profile per child)
          ├── stories ──────────── (1:N, all generated stories)
          ├── subscriptions ────── (1:1, Stripe billing)
          └── generation_logs ──── (1:N, monitoring & cost tracking)
```

## Tables

| Table | Purpose | Key Columns |
|-------|---------|-------------|
| `users` | Clerk-authenticated users | `email`, `clerk_id`, `name` |
| `user_voices` | ElevenLabs voice models | `user_id` (unique), `elevenlabs_voice_id` |
| `child_profiles` | Each child's preferences | `user_id`, `name`, `age`, `interests[]` |
| `stories` | Generated story content & media | `user_id`, `child_profile_id`, `title`, `story_text`, JSONB metadata |
| `subscriptions` | Stripe subscription billing | `user_id`, `plan_type`, `status`, quota tracking |
| `generation_logs` | Pipeline monitoring | Per-component success/failure/cost tracking |

## Quick Start

```bash
# 1. Run the migration (creates all tables)
psql "$DATABASE_URL" -f migration.sql

# 2. Seed with sample data (optional, for testing)
psql "$DATABASE_URL" -f seed.sql

# 3. Use the TypeScript interfaces
```

## TypeScript Usage

```typescript
import { sql } from "~/db";
import { toStory, toChildProfile, toPostgresArray } from "~/lib/schema";

// Query stories
const rows = await sql()`
  SELECT * FROM stories WHERE user_id = ${userId}
  ORDER BY generated_at DESC LIMIT 10
`;
const stories = rows.map((r: StoryRow) => toStory(r));

// Create a child profile
await sql()`
  INSERT INTO child_profiles (user_id, name, age, interests, themes)
  VALUES (${userId}, 'Luna', 5, ${toPostgresArray(['dinosaurs', 'space'])}, ${toPostgresArray(['magic'])})
`;
```

## Security

Row-Level Security (RLS) is enabled on all tables. In production, set `app.current_user_id` before queries:

```typescript
await sql()`SELECT set_config('app.current_user_id', ${userId}, TRUE)`;
```