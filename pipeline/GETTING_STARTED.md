# CorbaTales AI Pipeline — Getting Started

This guide walks you through setting up the CorbaTales AI pipeline from scratch. You'll need accounts with OpenAI and ElevenLabs, then configure the pipeline to generate stories, illustrations, and voice narration.

---

## 1. Prerequisites

- **Python 3.10+** (for the prototype script)
- **Bun or Node.js 18+** (for the TypeScript/website integration)
- **A credit card** (for API usage — costs are minimal)

---

## 2. Set Up OpenAI Account

### Step 1: Create an account
1. Go to [https://platform.openai.com/signup](https://platform.openai.com/signup)
2. Sign up with your email or Google/GitHub account
3. Verify your email address

### Step 2: Add billing
1. Go to [https://platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Click **"Add payment details"**
3. Add a credit card
4. **Recommended:** Set a Usage Limit of $10-20 to start (Settings → Usage limits → Hard limit)
   - Each story costs ~$0.04 (GPT-4o mini + DALL-E 3)
   - 30 stories = ~$1.20
   - Voice cloning = $5 one-time (ElevenLabs, not OpenAI)

### Step 3: Get your API key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Click **"Create new secret key"**
3. Name it `corbatales-pipeline`
4. Copy the key — it starts with `sk-...`
5. **Store it securely** — you won't be able to see it again

### Step 4: Verify the key works
```bash
curl https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  | python3 -m json.tool | head -10
```

---

## 3. Set Up ElevenLabs Account

### Step 1: Create an account
1. Go to [https://elevenlabs.io/app/sign-up](https://elevenlabs.io/app/sign-up)
2. Sign up with email
3. Verify your email address

### Step 2: Choose a plan
For development/testing, the **Starter** plan ($5/month) is sufficient:
- Includes 10,000 characters of TTS per month
- Voice cloning (Instant Voice Cloning)
- Access to all voice models

For production, the **Creator** plan ($22/month) or **Pro** plan ($99/month) may be needed.

### Step 3: Get your API key
1. Go to [https://elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys)
2. Click **"Create new API Key"**
3. Copy the key
4. Store it securely

### Step 4: Verify the key works
```bash
curl https://api.elevenlabs.io/v1/voices \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  | python3 -m json.tool | head -10
```

---

## 4. Set Environment Variables

Add these to your shell profile (`~/.bashrc`, `~/.zshrc`, or similar):

```bash
export OPENAI_API_KEY="sk-your-key-here"
export ELEVENLABS_API_KEY="your-elevenlabs-key-here"
```

Then reload:
```bash
source ~/.bashrc
```

Or set them inline for a single session:
```bash
export OPENAI_API_KEY="sk-..."
export ELEVENLABS_API_KEY="..."
```

---

## 5. Run the Pipeline

### Option A: Python Prototype (quick test)

```bash
# Install dependencies
cd /home/team/shared/pipeline
pip3 install --break-system-packages requests

# Run the demo (no API keys needed — shows sample output)
python3 pipeline.py demo

# Run the full pipeline (requires API keys)
python3 pipeline.py generate \
  --name "Luna" --age 5 \
  --interests "dinosaurs, space" \
  --themes "magic, adventure"
```

**Expected output:**
```
[00:00:01] 🚀 CORBATALES — Full Pipeline
[00:00:01] 📖 Generating story for Luna (age 5)...
[00:00:03] ✅ Story generated: "Luna and the Star Garden"
[00:00:03] 💰 Story Generation (GPT-4o mini): $0.0010
[00:00:03] 🎨 Generating illustration...
[00:00:08] ✅ Illustration generated!
[00:00:08] 💰 Illustration (DALL-E 3): $0.0400
[00:00:08] 🔊 Generating narration...
[00:00:11] ✅ Narration generated!
[00:00:11] 💰 TTS (ElevenLabs Turbo): $0.0820
```

### Option B: Sanity Test Script

```bash
cd /home/team/shared/pipeline
bash setup.sh
```

This will:
1. Check that Python 3.10+ is installed
2. Install required Python packages
3. Verify both API keys are set
4. Test the OpenAI API connection
5. Test the ElevenLabs API connection
6. Run the pipeline demo mode
7. Print a summary of what's working

---

## 6. Verify Everything Works

### Quick sanity checks

```bash
# Check OpenAI key is set
echo "OpenAI key: ${OPENAI_API_KEY:0:8}...${OPENAI_API_KEY: -4}"

# Check ElevenLabs key is set
echo "ElevenLabs key: ${ELEVENLABS_API_KEY:0:4}...${ELEVENLABS_API_KEY: -4}"

# Test OpenAI API
curl -s https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'OpenAI: {len(d[\"data\"])} models available')"

# Test ElevenLabs API
curl -s https://api.elevenlabs.io/v1/voices \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'ElevenLabs: {len(d[\"voices\"])} voices available')"
```

### Expected results
```
OpenAI key: sk-...abcd
ElevenLabs key: ab...cd12
OpenAI: 100+ models available
ElevenLabs: 10+ voices available
```

---

## 7. Generate Your First Story

```bash
cd /home/team/shared/pipeline
python3 pipeline.py generate \
  --name "Your Child's Name" \
  --age 5 \
  --interests "dinosaurs, space, princesses" \
  --themes "magic, adventure, friendship" \
  --voice-id "your-cloned-voice-id"  # optional
```

Output files are saved in `./corba-output/`:
- `story_YYYYMMDD_HHMMSS.json` — story text, scenes, moral
- `illustration_YYYYMMDD_HHMMSS.png` — generated illustration
- `narration_YYYYMMDD_HHMMSS.mp3` — audio narration

---

## 8. Voice Cloning (Optional)

To clone your voice for narration:

```bash
# 1. Record a 3-minute audio sample (WAV or MP3, 44.1kHz, mono)
# 2. Upload it to ElevenLabs
python3 pipeline.py clone-voice \
  --audio /path/to/your-recording.mp3 \
  --name "My Voice"
```

This prints a `voice_id`. Use it with `--voice-id` when generating stories.

---

## 9. Troubleshooting

| Problem | Check |
|---------|-------|
| `ModuleNotFoundError: No module named 'requests'` | Run `pip3 install --break-system-packages requests` |
| `OPENAI_API_KEY is not set` | Set the env var: `export OPENAI_API_KEY=sk-...` |
| `401 Unauthorized` | API key is invalid or expired — regenerate in OpenAI/ElevenLabs dashboard |
| `429 Too Many Requests` | Rate limited — wait 30 seconds and retry |
| `503 Service Unavailable` | OpenAI/ElevenLabs outage — check status pages |
| Cost too high | Set usage limits in OpenAI dashboard; use `--quality standard` for DALL-E |
| Voice cloning fails | Audio must be ≥3 minutes, clear audio, no background noise |

---

## 10. Cost Expectations

| Component | Cost per story | 30 stories/month |
|-----------|---------------|------------------|
| GPT-4o mini (story) | ~$0.001 | ~$0.03 |
| DALL-E 3 (illustration) | $0.04 | $1.20 |
| ElevenLabs Turbo (TTS) | ~$0.08-0.10 | ~$2.40-3.00 |
| **Total** | **~$0.12-0.14** | **~$3.63-4.23** |

Voice cloning: $5 one-time fee (ElevenLabs).