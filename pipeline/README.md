# CorbaTales AI Pipeline

Core AI pipeline for generating personalized bedtime stories with voice cloning, story generation, illustration, and text-to-speech.

## Directory Structure

```
pipeline/
├── ARCHITECTURE.md         # Full architecture design document
├── API_ENDPOINTS.md        # Full API endpoint specification
├── GETTING_STARTED.md      # Step-by-step setup guide (new!)
├── ERROR_MONITORING.md     # Error handling & troubleshooting (new!)
├── setup.sh                # Setup & sanity test script (new!)
├── fallback-stories.ts     # 5 fallback story templates (new!)
├── pipeline.py             # Python prototype (runnable demo)
├── pipeline.ts             # TypeScript API module (for website integration)
├── server-functions.ts     # TanStack Start server functions (ready to import)
└── README.md               # This file
```

## Quick Start

```bash
# 1. Run the setup script (checks everything)
bash setup.sh

# 2. Set API keys
export OPENAI_API_KEY=sk-...
export ELEVENLABS_API_KEY=...

# 3. Demo mode (no API keys)
python3 pipeline.py demo

# 4. Full pipeline
python3 pipeline.py generate \
  --name "Luna" --age 5 \
  --interests "dinosaurs, space" \
  --themes "magic, adventure"
```

## Setup Guide

See `GETTING_STARTED.md` for step-by-step instructions on:
- Creating OpenAI and ElevenLabs accounts
- Getting API keys
- Testing the pipeline
- Voice cloning
- Cost expectations

## Fallback Stories

When APIs are unavailable or rate-limited, `fallback-stories.ts` provides 5 complete stories:
1. **Luna and the Star-Seed Garden** — space/magic theme
2. **The Brave Little Cloud** — gentle encouragement
3. **Nova's Cosmic Journey** — space adventure
4. **The Whispering Forest** — nature/magic
5. **The Princess Who Built Robots** — STEM/creativity

Import in server functions:
```typescript
import { getFallbackStory, shouldUseFallback } from "~/lib/fallback-stories";
```

## Error Monitoring

See `ERROR_MONITORING.md` for:
- Quick diagnostics commands
- What to log for each generation
- Key metrics to track
- Common error messages & fixes
- Fallback chain priorities
- Alerting checklist

## Components

| Component | API | Cost/Story |
|-----------|-----|-----------|
| Voice Cloning | ElevenLabs | $5 one-time (setup) |
| Story Generation | OpenAI GPT-4o mini | ~$0.001 |
| Illustration | DALL-E 3 | $0.04 |
| Text-to-Speech | ElevenLabs Turbo | ~$0.08-0.20 |
| **Total per story** | | **~$0.12-0.24** |

## Business Model

| Metric | Value |
|--------|-------|
| Subscription | $12.99/month |
| Stories/month | 30 |
| COGS/subscriber | ~$3.62/month |
| **Gross margin** | **~72%** |