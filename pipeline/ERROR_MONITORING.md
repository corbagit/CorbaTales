# CorbaTales AI Pipeline — Error Monitoring & Troubleshooting

This document covers what to check when a story generation fails, how to monitor API health, and how to handle common errors.

---

## 1. Error Types & Quick Reference

| Error | How to Detect | Common Cause | Fix |
|-------|--------------|-------------|-----|
| **OpenAI key invalid** | 401 from API | Key expired, deleted, or wrong | Regenerate key at [platform.openai.com/api-keys](https://platform.openai.com/api-keys) |
| **OpenAI quota exceeded** | 429 or 402 | Billing limit reached, or insufficient credits | Add funds or raise usage limit at [platform.openai.com/account/billing](https://platform.openai.com/account/billing) |
| **OpenAI rate limited** | 429 "Rate limit" | Too many requests in short time | Wait 30-60s. Our pipeline backs off automatically (1s, 2s, 4s exponential) |
| **OpenAI timeout** | Connection timeout | Network issue or OpenAI overload | Retry. Check [status.openai.com](https://status.openai.com) |
| **ElevenLabs key invalid** | 401 from API | Key expired or wrong | Regenerate at [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys) |
| **ElevenLabs quota** | 429 or 402 | Plan character limit reached | Upgrade plan at [elevenlabs.io/app/subscription](https://elevenlabs.io/app/subscription) |
| **ElevenLabs voice not found** | 404 | voice_id doesn't exist or was deleted | Re-clone the voice, check voice_id in DB |
| **DALL-E content policy** | 400 "Content policy" | Prompt triggered safety filter | Rewrite prompt to be more age-appropriate. Use fallback illustration |
| **Network error** | Connection refused | DNS, proxy, or firewall issues | Check network connectivity. Verify API endpoints are reachable |
| **Internal server error** | 500 | OpenAI/ElevenLabs outage | Check status pages. Use fallback stories |

---

## 2. Quick Diagnostics

### 2.1 Run the setup sanity test
```bash
cd /home/team/shared/pipeline
bash setup.sh
```

This checks: Python version, dependencies, API keys, API connectivity, and pipeline demo.

### 2.2 Test OpenAI directly
```bash
# List models — should return 200
curl -s -o /dev/null -w "%{http_code}" \
  https://api.openai.com/v1/models \
  -H "Authorization: Bearer $OPENAI_API_KEY"

# Generate a quick story (test)
curl -s https://api.openai.com/v1/chat/completions \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [{"role": "user", "content": "Say hello in 5 words"}],
    "max_tokens": 20
  }' | python3 -c "import sys,json; print(json.load(sys.stdin)['choices'][0]['message']['content'])"
```

### 2.3 Test ElevenLabs directly
```bash
# List voices — should return 200
curl -s -o /dev/null -w "%{http_code}" \
  https://api.elevenlabs.io/v1/voices \
  -H "xi-api-key: $ELEVENLABS_API_KEY"

# Get available character balance
curl -s https://api.elevenlabs.io/v1/user/subscription \
  -H "xi-api-key: $ELEVENLABS_API_KEY" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); print(f'Plan: {d[\"tier\"]}, Characters used: {d[\"character_count\"]}/{d[\"character_limit\"]}')"
```

---

## 3. Logging & Monitoring

### 3.1 What to log for every story generation

```typescript
interface StoryGenerationLog {
  timestamp: string;
  userId: string;
  childProfileId: string;
  
  // Story generation
  storyModel: string;
  storyTokensIn: number;
  storyTokensOut: number;
  storyCost: number;
  storyDurationMs: number;
  storySuccess: boolean;
  storyError?: string;
  
  // Illustration
  illustrationModel: string;
  illustrationCost: number;
  illustrationDurationMs: number;
  illustrationSuccess: boolean;
  illustrationError?: string;
  
  // TTS
  ttsModel: string;
  ttsChars: number;
  ttsCost: number;
  ttsDurationMs: number;
  ttsSuccess: boolean;
  ttsError?: string;
  
  // Fallback
  usedFallback: boolean;
  
  // Total
  totalCost: number;
  totalDurationMs: number;
}
```

### 3.2 Key metrics to track

| Metric | Alert Threshold | Why |
|--------|----------------|-----|
| Story generation success rate | < 95% over 1 hour | OpenAI may be degraded |
| Illustration success rate | < 90% over 1 hour | DALL-E content policy or rate limit |
| TTS success rate | < 95% over 1 hour | ElevenLabs may be degraded |
| Average story duration | > 30 seconds | Pipeline may be bottlenecked |
| Fallback usage rate | > 5% over 1 hour | APIs may be having issues |
| Cost per story | > $0.25 | Model or settings may have changed |
| Voice cloning success | < 80% | Audio quality may be poor |

### 3.3 Dashboard queries (SQL)

```sql
-- Failed generations in last hour
SELECT COUNT(*) as failed
FROM generation_logs
WHERE generated_at > NOW() - INTERVAL '1 hour'
  AND (story_success = false OR illustration_success = false OR tts_success = false);

-- Average cost per story today
SELECT AVG(total_cost) as avg_cost, COUNT(*) as total
FROM generation_logs
WHERE generated_at > CURRENT_DATE;

-- Fallback usage rate
SELECT 
  COUNT(*) FILTER (WHERE used_fallback = true) * 100.0 / COUNT(*) as fallback_pct
FROM generation_logs
WHERE generated_at > NOW() - INTERVAL '1 hour';

-- Rate limit hits
SELECT COUNT(*) as rate_limits
FROM generation_logs
WHERE generated_at > NOW() - INTERVAL '1 hour'
  AND (story_error LIKE '%429%' OR illustration_error LIKE '%429%' OR tts_error LIKE '%429%');
```

---

## 4. Fallback Chain

When a component fails, the pipeline falls back gracefully:

```
Story Generation
  │
  ├── Success → Continue to illustration
  │
  └── Failed → Use fallback story from template library
                ↓
                Illustration (still attempted)
                  │
                  ├── Success → Continue to TTS
                  │
                  └── Failed → Use placeholder illustration
                                ↓
                                TTS (still attempted)
                                  │
                                  ├── Success → Return story with fallback image
                                  │
                                  └── Failed → Return story text only (no audio)
```

**Fallback priorities:**
1. **Story text** — always required. If GPT-4o mini fails → use fallback story template
2. **Illustration** — nice to have. If DALL-E 3 fails → use placeholder image or emoji
3. **Audio narration** — nice to have. If ElevenLabs TTS fails → serve story text only

---

## 5. Common Error Messages & Fixes

### "You exceeded your current quota"
**Cause:** OpenAI billing limit reached.
**Fix:** 
1. Go to [platform.openai.com/account/billing](https://platform.openai.com/account/billing)
2. Add funds or increase the hard limit
3. Expected cost: ~$4-5/month for 100 subscribers

### "Rate limit exceeded for model"
**Cause:** Too many requests to GPT-4o mini.
**Fix:**
- The pipeline has built-in exponential backoff (1s, 2s, 4s)
- If persistent, add a queue/delay between requests
- OpenAI allows 500 RPM (requests per minute) for GPT-4o mini on Tier 1

### "Content policy violation"
**Cause:** DALL-E 3 prompt triggered safety filter.
**Fix:**
- The prompt may contain words flagged as age-inappropriate
- Our prompts are prefixed with "Children's book illustration style" which helps
- If persistent, log the prompt and adjust the scene description generator

### "voice_id not found"
**Cause:** ElevenLabs voice was deleted or ID is wrong.
**Fix:**
1. Check the `voice_id` in the database
2. Verify it exists: `curl -s https://api.elevenlabs.io/v1/voices -H "xi-api-key: $KEY" | python3 -m json.tool`
3. If missing, re-clone the voice from the stored audio sample

### "Character limit exceeded"
**Cause:** ElevenLabs plan character limit reached.
**Fix:**
1. Check usage: `curl -s https://api.elevenlabs.io/v1/user/subscription -H "xi-api-key: $KEY"`
2. Upgrade plan or wait for monthly reset
3. The Starter plan ($5/mo) has ~10K characters = ~40 stories

---

## 6. Status Pages

Check these before debugging:

- **OpenAI Status:** [https://status.openai.com](https://status.openai.com)
- **ElevenLabs Status:** [https://status.elevenlabs.io](https://status.elevenlabs.io)
- **OpenAI API key usage:** [https://platform.openai.com/usage](https://platform.openai.com/usage)
- **ElevenLabs usage:** [https://elevenlabs.io/app/subscription](https://elevenlabs.io/app/subscription)

---

## 7. Alerting Checklist

When a user reports a failed story generation:

1. **Check API keys** — are they still valid? (They expire or get rotated)
2. **Check billing** — has the OpenAI/ElevenLabs account run out of funds?
3. **Check the logs** — what error was returned?
4. **Check status pages** — is there an ongoing outage?
5. **Check rate limits** — is the app hitting rate limits?
6. **Try the pipeline manually** — `python3 pipeline.py generate --name "Test" --age 5 ...`
7. **Verify the voice model** — does the voice_id still exist in ElevenLabs?
8. **Check recent changes** — was the prompt template changed recently?

---

## 8. Automated Recovery

The pipeline implements these recovery strategies:

| Failure | Recovery | Timeout |
|---------|----------|---------|
| OpenAI rate limit | Exponential backoff: 1s, 2s, 4s (3 retries) | 30s total |
| OpenAI timeout | Immediate retry (1 attempt) | 15s |
| ElevenLabs rate limit | Exponential backoff: 1s (1 retry) | 10s |
| Network error | Immediate retry (1 attempt) | 10s |
| DALL-E content policy | Skip illustration, return text only | N/A |
| Voice not found | Skip TTS, return text only | N/A |

If all retries fail, the pipeline falls back to a template story (see `fallback-stories.ts`).