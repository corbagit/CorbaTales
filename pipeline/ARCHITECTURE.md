# CorbaTales AI Pipeline Architecture

## Overview

The CorbaTales AI pipeline generates a brand-new, personalized bedtime story nightly — complete with original illustrations and narration in the parent's own voice. This document covers the architecture, API choices, cost estimates, and integration points.

---

## 1. Pipeline Components

```
┌─────────────────────────────────────────────────────────────────┐
│                      PARENT APP / WEB                           │
└──────────┬──────────────────────────────────────┬───────────────┘
           │ ① Voice Recording                     │ ② Child Profile
           │ (3 min sample)                        │ (age, interests, etc.)
           ▼                                       ▼
┌──────────────────────┐              ┌────────────────────────────┐
│  ① VOICE CLONING     │              │  ② STORY GENERATION        │
│  ElevenLabs Voice    │              │  OpenAI GPT-4o mini        │
│  Cloning API         │              │  + system prompt + child   │
│                      │              │  profile → unique story    │
│  → voice_id stored   │              │  → story text + metadata   │
└──────────────────────┘              └──────────┬─────────────────┘
                                                 │
                                                 ▼
                                     ┌────────────────────────────┐
                                     │  ③ ILLUSTRATION            │
                                     │  DALL-E 3                  │
                                     │  → scene descriptions      │
                                     │  → 1 image per story       │
                                     │  (or 1 per chapter)        │
                                     └──────────┬─────────────────┘
                                                 │
                                                 ▼
                                     ┌────────────────────────────┐
                                     │  ④ TEXT-TO-SPEECH          │
                                     │  ElevenLabs TTS            │
                                     │  + cloned voice_id         │
                                     │  → audio file (MP3)        │
                                     └──────────┬─────────────────┘
                                                 │
                                                 ▼
                                     ┌────────────────────────────┐
                                     │  ASSEMBLY & STORAGE        │
                                     │  story text + image + audio│
                                     │  → saved as digital        │
                                     │    illustrated keepsake    │
                                     └────────────────────────────┘
```

---

## 2. API Choices & Rationale

### 2.1 Voice Cloning — ElevenLabs

**Why ElevenLabs:**
- Industry leader in voice cloning — best quality for short samples (3 min)
- Instant voice cloning API: no training wait, 3-min sample → voice model
- Same platform for TTS — unified billing and API
- Supports "voice preview" so parents can hear the result before finalizing
- Voice stabilization to reduce artifacts from imperfect recordings

**API:** `POST https://api.elevenlabs.io/v1/voices/add` with sample file
**Result:** `voice_id` (stored in DB, reused for all TTS for that parent)

**Pricing:** Included in ElevenLabs subscription tiers.

### 2.2 Story Generation — OpenAI GPT-4o mini

**Why GPT-4o mini:**
- Excellent creative writing quality for children's content
- Extremely cost-effective: $0.15/1M input tokens, $0.60/1M output tokens
- Fast (~2-3 seconds per story)
- Strong safety filters appropriate for children's content
- Consistent JSON output with structured output mode

**Prompt design:**
- System prompt defines CorbaTales narrator persona, story structure rules
- User prompt includes child profile (name, age, interests, favorite themes, characters)
- Uses `response_format: { type: "json_object" }` for structured output
- Temperature: 0.8-0.9 (creative but coherent)

**Result:** JSON with `{ title, story_text, scene_descriptions, moral, word_count }`

### 2.3 Illustration Generation — DALL-E 3

**Why DALL-E 3:**
- Highest quality for children's story illustrations
- Integrated with OpenAI (same API key as story generation)
- Good at following detailed scene descriptions
- Safe for children's content
- Standard quality 1024x1024 images: $0.04/image

**Prompt design:** Scene descriptions from the story generator → prompt engineered for children's book illustration style (consistent art style, age-appropriate, warm colors)

**Result:** Image URL (stored for 1 hour, must be downloaded immediately)

### 2.4 Text-to-Speech — ElevenLabs

**Why ElevenLabs:**
- Best quality voice cloning → speech synthesis
- Uses the same `voice_id` from step 1
- Supports SSML for natural pacing, pauses, emphasis
- Multiple model options:
  - `eleven_turbo_v2_5` — fastest, good quality (for nightly use)
  - `eleven_multilingual_v2` — best quality, supports 29 languages
- Streaming support for progressive playback

**Pricing:** See ElevenLabs plan.

**Per-story cost:** ~$0.08-0.20 for a 500-word story depending on model choice.

---

## 3. Data Flow — Full Pipeline (per story)

```
INPUT: Child Profile + Parent voice_id
         │
         ▼
┌─────────────────────────────────────┐
│ 1. Generate Story (GPT-4o mini)     │  ~$0.001
│    Input: child_profile             │  ~2-3 sec
│    Output: {title, story, scenes}   │
└──────────────┬──────────────────────┘
               │ story_text + scene_descriptions
               ▼
┌─────────────────────────────────────┐
│ 2. Generate Illustration (DALL-E 3) │  ~$0.04
│    Input: scene_descriptions[0]     │  ~5-10 sec
│    Output: image_url                │
└──────────────┬──────────────────────┘
               │ image_url
               ▼
┌─────────────────────────────────────┐
│ 3. Generate Narration (ElevenLabs)  │  ~$0.08-0.20
│    Input: story_text + voice_id     │  ~3-5 sec
│    Output: audio_url (MP3)          │
└──────────────┬──────────────────────┘
               │ audio_url
               ▼
┌─────────────────────────────────────┐
│ 4. Assemble & Store                 │
│    Save to DB: story_text,          │
│    image_url, audio_url, metadata   │
│    Return: story_id + URLs          │
└─────────────────────────────────────┘
```

**Total time per story:** ~10-20 seconds (async pipeline)
**Total cost per story:** ~$0.12-0.24

---

## 4. Cost Analysis

### 4.1 Per-Story Costs

| Component | API | Cost | Notes |
|-----------|-----|------|-------|
| Story Generation | GPT-4o mini | ~$0.001 | ~500 words, structured output |
| Illustration | DALL-E 3 (standard) | $0.04 | 1024×1024, 1 image per story |
| Text-to-Speech | ElevenLabs Turbo | ~$0.08 | ~2,500 chars (500 words) |
| **Total per story** | | **~$0.12** | |

### 4.2 Monthly Costs Per Subscriber

| Item | Calculation | Cost |
|------|-------------|------|
| 30 stories/month | 30 × $0.12 | $3.60 |
| Voice cloning (one-time) | $0 (setup fee amortized) | ~$0.00 |
| CDN/storage | Image + audio hosting | ~$0.02 |
| **Total per subscriber** | | **~$3.62/month** |

### 4.3 Gross Margin at $12.99/month

| Metric | Value |
|--------|-------|
| Revenue | $12.99 |
| COGS (variable) | $3.62 |
| **Gross margin** | **$9.37 (72%)** |

This is healthy — plenty of room for payment processing fees (~$0.50-0.60) and overhead.

### 4.4 Scaling Considerations

**At 100 subscribers:** ~$362/month in API costs — manageable on a single API key.
**At 1,000 subscribers:** ~$3,620/month — negotiate volume pricing with OpenAI/ElevenLabs.
**Optimizations:**
- Cache identical stories? No — each is unique. But cache voice models.
- Batch TTS: Combine multiple stories into a single API call.
- Image generation: Generate 1 illustration per story (not per chapter) for MVP.
- Consider Stability AI (SDXL) for illustrations at $0.01/image if volume grows.

---

## 5. Voice Cloning Process

### 5.1 Recording Requirements
- **Duration:** 3 minutes minimum
- **Quality:** 16-bit, 44.1kHz, mono, no background noise
- **Content:** Read a provided script (variety of sentences, emotions, pacing)
- **Browser:** WebRTC-based recorder in the browser (MediaRecorder API)
- **Format:** WAV or MP3

### 5.2 ElevenLabs API Flow

```
POST /v1/voices/add
  - files: audio_sample
  - name: "parent_{user_id}"
  - labels: { "accent": "american", "gender": "male/female" }
→ Returns: voice_id

Usage: POST /v1/text-to-speech/{voice_id}
  - text: story_text
  - model_id: "eleven_turbo_v2_5"
  - voice_settings: { stability: 0.5, similarity_boost: 0.75 }
→ Returns: audio stream (MP3)
```

### 5.3 Voice Model Storage
- `voice_id` stored in the `user_voices` table
- Each parent has exactly one voice model
- Voice model persists across sessions (ElevenLabs manages the model)

---

## 6. Story Generation — Prompt Engineering

### 6.1 System Prompt (fixed)

```
You are CorbaTales, an AI bedtime story generator for children ages 2-10.
You create unique, warm, and engaging stories that are:
- Age-appropriate (vocabulary, themes, length)
- Positive and uplifting (gentle lessons, happy endings)
- Imaginative but coherent (logical plot within the story world)
- Culturally inclusive and diverse

Rules:
- Stories must be 400-800 words
- Always include a gentle moral or lesson
- Use warm, descriptive language
- Create 3-5 scene descriptions for illustrations
- Never include scary or violent content
- The protagonist should be relatable to the child
- Output in JSON format
```

### 6.2 User Prompt (per-story, dynamic)

```
Generate a bedtime story for:
- Child's name: {name}
- Age: {age}
- Interests: {interests}
- Favorite themes: {themes}
- Favorite characters/animals: {characters}
- Setting preference: {setting}
- Today's special element: {special_element} (e.g., "include a shooting star")

Output JSON:
{
  "title": "Story Title",
  "story_text": "Full story text...",
  "scene_descriptions": [
    "Description of scene 1 for illustration...",
    "Description of scene 2 for illustration..."
  ],
  "moral": "The gentle lesson...",
  "word_count": 523
}
```

---

## 7. Illustration Prompt Engineering

For each story scene, we generate a DALL-E 3 prompt:

```
Template:
"Children's book illustration style. {scene_description}. 
Warm, soft colors. Friendly characters. Age-appropriate for 
children {age_range}. Digital illustration style, cozy 
bedtime aesthetic. No text in the image."

Example:
"Children's book illustration style. A brave little rabbit 
in a blue scarf stands at the edge of a magical forest with 
glowing mushrooms and friendly fireflies. Warm, soft colors. 
Friendly characters. Age-appropriate for children 3-5. 
Digital illustration style, cozy bedtime aesthetic. 
No text in the image."
```

---

## 8. Database Schema (for AI pipeline)

```sql
-- Voice models
CREATE TABLE user_voices (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  elevenlabs_voice_id TEXT NOT NULL,
  voice_name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Child profiles
CREATE TABLE child_profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  interests TEXT[],
  themes TEXT[],
  characters TEXT[],
  settings TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);

-- Generated stories
CREATE TABLE stories (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id),
  child_profile_id UUID REFERENCES child_profiles(id),
  title TEXT NOT NULL,
  story_text TEXT NOT NULL,
  scene_descriptions JSONB,
  moral TEXT,
  word_count INTEGER,
  image_url TEXT,
  audio_url TEXT,
  generated_at TIMESTAMP DEFAULT NOW(),
  listened_count INTEGER DEFAULT 0,
  is_favorite BOOLEAN DEFAULT FALSE
);
```

---

## 9. Integration Points for Full-Stack Engineer

### 9.1 Environment Variables Needed

```
# OpenAI (GPT-4o mini + DALL-E 3)
OPENAI_API_KEY=sk-...

# ElevenLabs (Voice Cloning + TTS)
ELEVENLABS_API_KEY=...

# Storage (for downloaded images/audio)
STORAGE_BUCKET=...  # S3, R2, or similar
```

### 9.2 API Endpoints the Pipeline Needs

The Full-Stack Engineer will need to wire up:

```typescript
// 1. Voice Recording → Upload → Clone
POST /api/voice/upload       // Upload 3-min audio sample
POST /api/voice/clone        // Trigger ElevenLabs voice cloning
GET  /api/voice/status       // Check cloning status

// 2. Story Generation
POST /api/stories/generate   // Generate a new story
POST /api/stories/batch      // Generate stories in advance

// 3. Story Library
GET  /api/stories            // List stories
GET  /api/stories/:id        // Get story details (text, image, audio)
POST /api/stories/:id/favorite  // Toggle favorite
POST /api/stories/:id/replay    // Replay narration

// 4. Child Profile
POST /api/child-profiles     // Create/edit child profile
GET  /api/child-profiles/:id // Get profile
```

### 9.3 Server Function (TanStack) Integration

The pipeline logic should live in server functions:

```typescript
import { createServerFn } from "@tanstack/react-start";

const generateStory = createServerFn({ method: "POST" })
  .validator((d: { childProfileId: string }) => d)
  .handler(async ({ data }) => {
    // 1. Load child profile from DB
    // 2. Call GPT-4o mini → story text
    // 3. Call DALL-E 3 → illustration
    // 4. Call ElevenLabs → audio narration
    // 5. Save story to DB
    // 6. Return story data
  });
```

---

## 10. Error Handling & Retry Strategy

| Error | Handling | Retry? |
|-------|----------|--------|
| OpenAI rate limit | Exponential backoff (1s, 2s, 4s) | Yes (3x) |
| DALL-E content policy | Return fallback image + log warning | No |
| ElevenLabs voice not found | Re-clone voice from stored sample | Yes (1x) |
| Network timeout | Retry with backoff | Yes (3x) |
| API key invalid | Log critical error, alert admin | No |

**Fallback chain:** If TTS fails → return story text only (no audio). If image fails → return story with text only. Core story text is the only hard dependency.

---

## 11. Security & Content Safety

- **OpenAI content filter:** Enable `moderation` check on story output
- **Age gating:** Stories generated according to the child's age group
- **No PII in prompts:** Child's name is used only in story content, never in API metadata
- **Audio storage:** Voice recordings and generated audio stored encrypted
- **Rate limiting:** Max 1 story generation per 5 minutes per user (to prevent abuse)

---

## 12. Future Optimizations

- **Batch generation:** Generate stories during off-peak hours (e.g., 2 AM) for the next night
- **Story series:** Track previous stories to create multi-night arcs
- **Multi-language:** ElevenLabs supports 29 languages via `eleven_multilingual_v2`
- **Custom styles:** Let parents choose illustration style (watercolor, pencil, digital)
- **Audio preview:** Let parents preview and re-generate narration if pacing is off
- **Caching:** Cache illustration prompts that produce good results as templates