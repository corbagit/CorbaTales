---
name: setup-ai-pipeline
description: Step-by-step procedure to set up and verify the CorbaTales AI pipeline (API keys, deps, sanity test). Run before any AI pipeline work.
---

# Setting Up the CorbaTales AI Pipeline

## Prerequisites

- Python 3.10+
- OpenAI API key (`sk-...`)
- ElevenLabs API key

## Setup Steps

1. **Set environment variables:**
   ```bash
   export OPENAI_API_KEY="sk-..."
   export ELEVENLABS_API_KEY="..."
   ```

2. **Run the setup script:**
   ```bash
   cd /home/team/shared/pipeline
   bash setup.sh
   ```

3. **What the script checks:**
   - Python version (3.10+)
   - Python dependencies (`requests` package)
   - API key presence and length
   - OpenAI API connectivity
   - ElevenLabs API connectivity
   - Pipeline demo mode (no API keys needed)
   - All pipeline artifacts exist

4. **If setup passes with only "no API key" warnings**, the pipeline is ready once keys are provided.

5. **Run a real story:**
   ```bash
   python3 pipeline.py generate --name "Luna" --age 5 --interests "dinosaurs, space" --themes "magic"
   ```

## Fallback Mode

When APIs are unavailable, use `fallback-stories.ts` — 5 complete template stories. Import:
```typescript
import { getFallbackStory, shouldUseFallback } from "~/lib/fallback-stories";
```

## Cost Reference

- Per story: ~$0.14 (GPT-4o mini: $0.001, DALL-E 3: $0.04, ElevenLabs TTS: ~$0.10)
- Per subscriber/month: ~$4.22 COGS at 30 stories
- Gross margin at $12.99/mo: ~67%