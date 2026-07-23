# CorbaTales AI API Endpoints

This document specifies all API endpoints the Full-Stack Engineer needs to build for the CorbaTales website. These are server-side endpoints (implemented as TanStack `createServerFn()` functions or API routes) that the frontend calls.

---

## 1. Voice Cloning

### POST /api/voice/upload
Upload the parent's 3-minute audio recording.

**Request:**
```
Content-Type: multipart/form-data
- audio: File (WAV or MP3, 3-min minimum)
- voiceName: string
```

**Response:**
```json
{
  "uploadId": "uuid",
  "status": "uploaded",
  "duration": 183
}
```

### POST /api/voice/clone
Trigger voice cloning via ElevenLabs.

**Request:**
```json
{
  "uploadId": "uuid",
  "voiceName": "Mom's Voice"
}
```

**Response:**
```json
{
  "voiceId": "elevenlabs_voice_id",
  "status": "cloning",
  "estimatedSeconds": 15
}
```

### GET /api/voice/status
Check cloning status.

**Query params:** `voiceId=elevenlabs_voice_id`

**Response:**
```json
{
  "voiceId": "elevenlabs_voice_id",
  "status": "ready",
  "previewUrl": "https://..."
}
```

### GET /api/voice/preview
Preview the cloned voice with a sample sentence.

**Query params:** `voiceId=elevenlabs_voice_id`

**Response:** Audio stream (MP3)

---

## 2. Story Generation

### POST /api/stories/generate
Generate a new personalized bedtime story.

**Request:**
```json
{
  "childProfileId": "uuid",
  "specialElement": "Optional special element for tonight's story"
}
```

**Response:**
```json
{
  "storyId": "uuid",
  "title": "Luna and the Star-Seed Garden",
  "storyText": "Full story text...",
  "sceneDescriptions": [
    "Description of scene 1",
    "Description of scene 2",
    "Description of scene 3"
  ],
  "moral": "The gentle lesson...",
  "wordCount": 612,
  "imageUrl": "https://cdn.corbatales.com/stories/uuid/image.png",
  "audioUrl": "https://cdn.corbatales.com/stories/uuid/audio.mp3",
  "generatedAt": "2026-07-16T00:00:00Z",
  "cost": {
    "storyGeneration": 0.001,
    "illustration": 0.04,
    "tts": 0.10,
    "total": 0.141
  }
}
```

### GET /api/stories
List all stories for a user.

**Query params:** `userId=uuid`, `page=1`, `limit=20`

**Response:**
```json
{
  "stories": [
    {
      "id": "uuid",
      "title": "Story Title",
      "moral": "The lesson...",
      "imageUrl": "https://...",
      "generatedAt": "2026-07-16T00:00:00Z",
      "listenedCount": 3,
      "isFavorite": false
    }
  ],
  "total": 42,
  "page": 1,
  "limit": 20
}
```

### GET /api/stories/:id
Get full story details (text, image, audio).

**Response:** Full story object (same as generate response)

### POST /api/stories/:id/favorite
Toggle favorite status.

**Request:**
```json
{
  "isFavorite": true
}
```

**Response:**
```json
{
  "storyId": "uuid",
  "isFavorite": true
}
```

### POST /api/stories/:id/replay
Regenerate the audio narration (e.g., if user wants to change voice settings).

**Response:**
```json
{
  "audioUrl": "https://...",
  "regeneratedAt": "2026-07-16T00:00:00Z"
}
```

---

## 3. Child Profiles

### POST /api/child-profiles
Create or update a child profile.

**Request:**
```json
{
  "name": "Luna",
  "age": 5,
  "interests": ["dinosaurs", "space", "dancing"],
  "themes": ["magic", "adventure", "friendship"],
  "characters": ["rabbits", "dinosaurs"],
  "settings": ["forest", "ocean", "space"]
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "Luna",
  "age": 5,
  "interests": ["dinosaurs", "space", "dancing"],
  "themes": ["magic", "adventure", "friendship"],
  "characters": ["rabbits", "dinosaurs"],
  "settings": ["forest", "ocean", "space"],
  "createdAt": "2026-07-16T00:00:00Z"
}
```

### GET /api/child-profiles/:id
Get child profile.

**Response:** Full profile object

---

## 4. Webhooks (for async processing)

### POST /webhooks/elevenlabs/voice-cloned
ElevenLabs notifies us when voice cloning is complete.

**Request:**
```json
{
  "voice_id": "elevenlabs_voice_id",
  "status": "done"
}
```

### POST /webhooks/storage/image-ready
Image upload complete notification.

**Request:**
```json
{
  "storyId": "uuid",
  "imageUrl": "https://cdn.corbatales.com/stories/uuid/image.png"
}
```

---

## 5. Server Function Integration (TanStack)

The Full-Stack Engineer should implement these as `createServerFn()` functions:

```typescript
// In src/lib/api/stories.ts
import { createServerFn } from "@tanstack/react-start";

// Generate a story
export const generateStory = createServerFn({ method: "POST" })
  .validator((d: { childProfileId: string; specialElement?: string }) => d)
  .handler(async ({ data }) => {
    const { runFullPipeline } = await import("~/lib/pipeline");
    const childProfile = await getChildProfile(data.childProfileId);
    const result = await runFullPipeline({
      childName: childProfile.name,
      age: childProfile.age,
      interests: childProfile.interests,
      themes: childProfile.themes,
      characters: childProfile.characters,
      setting: childProfile.settings?.[0],
      specialElement: data.specialElement,
      voiceId: childProfile.parentVoiceId,
    });
    // Save to DB and return
    return saveStory(result);
  });

// List stories
export const listStories = createServerFn({ method: "GET" })
  .validator((d: { userId: string; page?: number; limit?: number }) => d)
  .handler(async ({ data }) => {
    const { sql } = await import("~/db");
    const rows = await sql`
      SELECT id, title, moral, image_url, generated_at, listened_count, is_favorite
      FROM stories
      WHERE user_id = ${data.userId}
      ORDER BY generated_at DESC
      LIMIT ${data.limit ?? 20}
      OFFSET ${((data.page ?? 1) - 1) * (data.limit ?? 20)}
    `;
    return { stories: rows.map(r => ({ ...r, generated_at: String(r.generated_at) })) };
  });
```

---

## 6. Environment Variables

```bash
OPENAI_API_KEY=sk-...           # Story generation + illustration
ELEVENLABS_API_KEY=...          # Voice cloning + TTS
STORAGE_PROVIDER=s3             # CDN for images/audio
STORAGE_BUCKET=corbatales-media # Bucket name
STORAGE_REGION=us-east-1        # Region
DATABASE_URL=postgres://...     # Database
```

---

## 7. Rate Limiting

| Endpoint | Limit | Window |
|----------|-------|--------|
| POST /api/stories/generate | 3 requests | per 15 min per user |
| POST /api/voice/clone | 1 request | per 24h per user |
| GET /api/stories | 60 requests | per min per user |

---

## 8. Error Codes

| Code | Meaning | HTTP |
|------|---------|------|
| `voice_cloning_in_progress` | Already cloning | 409 |
| `story_generation_rate_limit` | Too many stories | 429 |
| `api_key_missing` | Server misconfigured | 500 |
| `openai_error` | Story gen failed | 502 |
| `elevenlabs_error` | Voice/TTS failed | 502 |
| `invalid_audio` | Audio too short/poor | 400 |