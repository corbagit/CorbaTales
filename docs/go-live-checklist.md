# CorbaTales — Go-Live Checklist

## Before You Go Live

### 1. Environment Variables
- [ ] Create Clerk account at https://dashboard.clerk.com
  - [ ] Create application, copy `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
- [ ] Create/configure Stripe account at https://dashboard.stripe.com
  - [ ] Copy `STRIPE_SECRET_KEY` and `STRIPE_PUBLISHABLE_KEY`
  - [ ] Create products (Monthly $12.99, Annual $99.99) → copy `price_xxx` IDs
  - [ ] Configure webhook endpoint pointing to `/api/webhooks/stripe` → copy `whsec_...`
- [ ] Create OpenAI API key at https://platform.openai.com/api-keys
  - [ ] Copy `OPENAI_API_KEY` (needs access to GPT-4o-mini + DALL-E 3)
- [ ] Create ElevenLabs API key at https://elevenlabs.io/app/settings/api-keys
  - [ ] Copy `ELEVENLABS_API_KEY`
- [ ] (Optional) Set up Neon DB at https://neon.tech → copy `DATABASE_URL`
- [ ] Set environment variables in Vercel project dashboard (Settings → Environment Variables)

### 2. Vercel Deployment
- [ ] Generate Vercel token at https://vercel.com/account/tokens
- [ ] Run `bun run go-live` with `VERCEL_TOKEN` set
  - Wait for "LIVE: <url>" output
- [ ] Verify the live URL loads correctly
- [ ] Test all pages: /, /pricing, /signup, /login, /privacy, /terms, /cookies
- [ ] Test authenticated pages (requires Clerk keys configured in Vercel)

### 3. Authentication (Clerk)
- [ ] In Clerk dashboard → Configure proper redirect URLs (your live domain)
- [ ] Set up email/password + magic link auth methods
- [ ] Customize Clerk appearance to match branding (dark theme)

### 4. Payments (Stripe)
- [ ] Test checkout flow in test mode
- [ ] Set up webhook endpoint in Stripe dashboard → point to `https://your-domain.com/api/webhooks/stripe`
- [ ] Configure subscription cancellation and proration behavior
- [ ] Test successful payment → subscription activated flow
- [ ] Test cancelled payment → error handling flow
- [ ] Switch to live mode when ready

### 5. AI Pipeline
- [ ] Verify OpenAI API key has access to GPT-4o-mini and DALL-E 3
- [ ] Test story generation with a sample child profile
- [ ] Test illustration generation
- [ ] Verify ElevenLabs voice cloning works
- [ ] Test TTS narration output
- [ ] Set up content moderation / safety filters

### 6. Custom Domain (Optional)
- [ ] Buy domain (e.g., corbatales.com)
- [ ] Add domain in Vercel project Settings → Domains
- [ ] Configure DNS (CNAME or A record as instructed by Vercel)
- [ ] Wait for SSL certificate provisioning (~5 min)
- [ ] Update Clerk redirect URLs to use custom domain

### 7. Pre-Launch Checks
- [ ] Test on mobile (iPhone, Android)
- [ ] Test on tablet
- [ ] Test on desktop (Chrome, Firefox, Safari)
- [ ] Verify all links work (no 404s)
- [ ] Check that the story demo on the landing page works
- [ ] Verify voice recording flow (microphone permissions, upload)
- [ ] Verify story library loads and plays correctly
- [ ] Test subscription upgrade/downgrade flow
- [ ] Verify email notifications (welcome, receipt, etc.)
- [ ] Test cancellation flow
- [ ] Test account deletion

### 8. Launch
- [ ] Run `bun run go-live` with final `VERCEL_TOKEN`
- [ ] Announce on social channels
- [ ] Monitor error logs for first 24 hours
- [ ] Set up uptime monitoring (e.g., Better Uptime, Pingdom)

## Post-Launch
- [ ] Monitor Stripe subscription metrics
- [ ] Track story generation success rate
- [ ] Monitor OpenAI/ElevenLabs API costs
- [ ] Set up recurring cost budget alerts
- [ ] Collect user feedback for first week
- [ ] Plan for printed keepsake book fulfillment logistics