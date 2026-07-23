---
name: ai-pipeline-integration
description: How to integrate the CorbaTales AI pipeline (story gen, voice cloning, illustration, TTS) into the TanStack Start website.
---

# Integrating the CorbaTales AI Pipeline

## Files

The AI pipeline lives at `/home/team/shared/pipeline/` with these key files:

- `pipeline.ts` — Core TypeScript API module (import directly into server functions)
- `server-functions.ts` — Ready-to-use TanStack Start server functions
- `API_ENDPOINTS.md` — Full REST API specification
- `ARCHITECTURE.md` — Complete architecture design and cost analysis
- `pipeline.py` — Python prototype with demo mode (no API keys needed for demo)

## Setup

1. **Copy server functions** into the site:
   ```bash
   cp /home/team/shared/pipeline/server-functions.ts /home/team/shared/site/src/lib/server/stories.ts
   cp /home/team/shared/pipeline/pipeline.ts /home/team/shared/site/src/lib/pipeline.ts
   ```

2. **Set environment variables** in the site:
   ```
   OPENAI_API_KEY=sk-...           # Required for story + illustration
   ELEVENLABS_API_KEY=...          # Required for voice + TTS
   ```

3. **Add database tables** — the server functions use `sql` from `~/db` and expect these tables:
   - `stories` (id, user_id, child_profile_id, title, story_text, scene_descriptions, moral, word_count, image_url, audio_url, generated_at, listened_count, is_favorite)
   - `child_profiles` (id, user_id, name, age, interests, themes, characters, settings, voice_id, created_at)
   - `user_voices` (id, user_id, elevenlabs_voice_id, voice_name, created_at)

## Usage in Routes

```tsx
import { createServerFn } from "@tanstack/react-start";
import { generateStory } from "~/lib/server/stories";

// In a route component:
const story = await generateStory({
  data: { childProfileId: "uuid" }
});
```

## Cost Awareness

- Each story generation costs ~$0.14 (GPT-4o mini: $0.001, DALL-E 3: $0.04, ElevenLabs TTS: ~$0.10)
- Rate limit: max 3 story generations per 15 minutes per user
- Voice cloning is a one-time cost (~$5 amortized)