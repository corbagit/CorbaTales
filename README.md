# CorbaTales

**AI-Powered Bedtime Stories — Narrated in Your Voice**

Every night, a brand-new, never-before-told bedtime story for your child — narrated in *your* voice. Record 3 minutes once, answer a few questions about your child's interests, and each night AI creates a fresh story personalized just for them, with original illustrations and voice narration. Every story is saved as a digital illustrated keepsake.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Build & Deploy](#build--deploy)
- [Pricing & Revenue Model](#pricing--revenue-model)
- [Team Structure](#team-structure)
- [Live Site Preview](#live-site-preview)
- [Documentation Index](#documentation-index)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7) |
| **Styling** | Tailwind CSS v4 |
| **Runtime** | [Bun](https://bun.sh) |
| **Language** | TypeScript |
| **Authentication** | [Clerk](https://clerk.com) — email/password + magic link |
| **Payments** | [Stripe](https://stripe.com) — subscription management |
| **AI Story Generation** | OpenAI GPT-4o-mini |
| **Illustrations** | OpenAI DALL-E 3 |
| **Voice Cloning & TTS** | [ElevenLabs](https://elevenlabs.io) |
| **Database** | Neon (serverless Postgres) |
| **Hosting** | Vercel |

### Brand Identity

| Element | Value |
|---------|-------|
| **Primary Colors** | Midnight Blue `#1B1B3A` · Golden Amber `#F5A623` · Warm Cream `#FFF8F0` |
| **Secondary Colors** | Soft Lavender `#C4A1E0` · Calm Teal `#4ECDC4` · Charcoal `#2D2D2D` · Soft Coral `#FF6B6B` |
| **Heading Font** | Playfair Display |
| **Body Font** | Nunito |
| **UI Font** | Inter |

---

## Directory Structure

```
/home/team/shared/
├── README.md                          ← You are here
├── site/                              ← Main web application
│   ├── src/
│   │   ├── routes/                    ← File-based routing (TanStack Start)
│   │   │   ├── __root.tsx             # Root layout, SEO, Clerk provider
│   │   │   ├── index.tsx              # Landing page (marketing)
│   │   │   ├── pricing.tsx            # Pricing page
│   │   │   ├── signup.tsx             # Sign up (Clerk)
│   │   │   ├── login.tsx              # Log in (Clerk)
│   │   │   ├── privacy.tsx            # Privacy Policy
│   │   │   ├── terms.tsx              # Terms of Service
│   │   │   ├── cookies.tsx            # Cookie Policy
│   │   │   ├── dashboard.tsx          # Authenticated dashboard
│   │   │   └── dashboard/
│   │   │       ├── voice.tsx          # Voice recording flow
│   │   │       ├── library.tsx        # Story library
│   │   │       └── settings.tsx       # Child preferences + account
│   │   ├── components/
│   │   │   ├── layout.tsx             # Header, Footer, Stars
│   │   │   ├── Logo.tsx               # SVG brand logo
│   │   │   ├── AuthGuard.tsx          # Protected route wrapper
│   │   │   └── StoryDemo.tsx          # Interactive landing page demo
│   │   ├── lib/
│   │   │   ├── auth.ts                # Clerk configuration
│   │   │   ├── stripe.ts              # Stripe config + plan constants
│   │   │   ├── stripe-server.ts       # Checkout session server function
│   │   │   ├── pipeline.ts            # AI pipeline (OpenAI + ElevenLabs)
│   │   │   └── story-service.ts       # Server functions wrapping pipeline
│   │   └── styles/
│   │       └── app.css                # Tailwind + brand design system
│   ├── vite.config.ts                 # Vite config (binds to 0.0.0.0:3000)
│   ├── vercel-entry.ts                # Vercel SSR entry point
│   ├── build-vercel.sh                # Builds .vercel/output bundle
│   ├── go-live.sh                     # Deploys to Vercel
│   ├── publish.sh                     # Rebuilds + restarts local preview
│   ├── serve.ts                       # Production server entry
│   ├── package.json
│   ├── tsconfig.json
│   ├── site.json                      # Site metadata
│   ├── .env.example                   ← Environment variable template
│   └── SITE.md                        ← Site-specific documentation
├── pipeline/                          ← AI pipeline (Python + TypeScript)
│   ├── pipeline.py                    # Prototype pipeline script
│   ├── pipeline.ts                    # TypeScript pipeline module
│   ├── setup.sh                       # Sanity test script
│   ├── GETTING_STARTED.md             # Pipeline setup guide
│   └── README.md                      # Pipeline documentation
├── design/                            ← Brand identity & design tokens
├── docs/
│   └── go-live-checklist.md           ← Production launch checklist
├── database/                          ← Database migrations & schema
└── skills/                            ← Team agent skills
```

---

## Setup Instructions

### 1. Prerequisites

- **Bun** (v1.3+) — [install](https://bun.sh)
- **Python 3.10+** — for pipeline prototyping
- Accounts on the services listed in [Environment Variables](#environment-variables)

### 2. Clone & Install

```bash
cd /home/team/shared/site
bun install
```

### 3. Configure Environment

```bash
cp .env.example .env
# Edit .env with your API keys (see Environment Variables below)
```

### 4. Start Local Development

```bash
bun run dev
# Opens on http://localhost:3000
```

### 5. Set Up the AI Pipeline

See **[pipeline/GETTING_STARTED.md](pipeline/GETTING_STARTED.md)** for step-by-step instructions on:
- Creating OpenAI and ElevenLabs accounts
- Adding billing and setting usage limits
- Obtaining API keys
- Running the pipeline (story generation + illustration + TTS)
- Voice cloning setup
- Cost expectations (~$0.12-0.14 per story, ~$4/month for 30 stories)

Quick sanity test:
```bash
cd /home/team/shared/pipeline
bash setup.sh
```

### 6. Production Launch

See **[docs/go-live-checklist.md](docs/go-live-checklist.md)** for the full launch checklist covering:
- Environment variable configuration
- Vercel deployment (`bun run go-live`)
- Clerk authentication setup
- Stripe payment configuration
- AI pipeline verification
- Pre-launch testing (mobile, tablet, desktop)
- Post-launch monitoring

---

## Environment Variables

All environment variables are documented in **[site/.env.example](site/.env.example)**.

| Variable | Service | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk | Client-side auth initialization |
| `CLERK_SECRET_KEY` | Clerk | Server-side auth verification |
| `STRIPE_SECRET_KEY` | Stripe | Server-side payment processing |
| `STRIPE_PUBLISHABLE_KEY` | Stripe | Client-side checkout initialization |
| `STRIPE_PRICE_MONTHLY` | Stripe | Price ID for $12.99/mo plan |
| `STRIPE_PRICE_ANNUAL` | Stripe | Price ID for $99.99/yr plan |
| `STRIPE_WEBHOOK_SECRET` | Stripe | Webhook signature verification |
| `OPENAI_API_KEY` | OpenAI | Story generation (GPT-4o-mini) + illustrations (DALL-E 3) |
| `ELEVENLABS_API_KEY` | ElevenLabs | Voice cloning + text-to-speech narration |
| `DATABASE_URL` | Neon | Postgres connection string (optional, for user data persistence) |
| `VERCEL_TOKEN` | Vercel | Personal access token for `bun run go-live` deployment |

### How to Get Each Key

| Key | Get It Here |
|-----|-------------|
| Clerk keys | https://dashboard.clerk.com → Create Application |
| Stripe keys | https://dashboard.stripe.com → Developers → API keys |
| Stripe Price IDs | https://dashboard.stripe.com/products → Create products |
| OpenAI key | https://platform.openai.com/api-keys |
| ElevenLabs key | https://elevenlabs.io/app/settings/api-keys |
| Neon DB URL | https://neon.tech → Create database |
| Vercel token | https://vercel.com/account/tokens |

---

## Build & Deploy

### Local Preview (Port 3000)

```bash
cd /home/team/shared/site
bun run publish
# Rebuilds and restarts the server on port 3000
# Preview: https://4497395f80d7bf602e6505d07bcfa780.ctonew.app
```

### Production Build

```bash
bun run build
# Outputs to dist/ (client) and dist/server/ (SSR)
```

### Vercel Deployment

```bash
export VERCEL_TOKEN=...
bun run go-live
# Builds .vercel/output → deploys → makes project public → prints "LIVE: <url>"
```

The deployment pipeline:
1. `build-vercel.sh` — bundles the SSR handler + deps into `.vercel/output`
2. `go-live.sh` — deploys via `vercel deploy --prebuilt`, disables SSO protection, prints URL

If the site uses a database, `DATABASE_URL` is automatically passed to production. Re-run `bun run go-live` after connecting a database so production picks up the URL.

---

## Pricing & Revenue Model

| Plan | Price | Details |
|------|-------|---------|
| **Monthly** | $12.99/mo | 30 fresh stories, unlimited library, cancel anytime |
| **Annual** | $99.99/yr | 35% savings, bonus holiday story arcs, episodic series |
| **Gift** | $12.99/mo or $99.99/yr | Stories in the giver's voice, perfect for grandparents |
| **Physical Keepsake** | $24.99 (+ Shipping &amp; Handling) | Hardcover printed book of 10 favorite stories |

---

## Team Structure

| Role | Responsibilities |
|------|-----------------|
| **Full-Stack Engineer** | Website development (React, TanStack Start, TypeScript), authentication, payments, dashboard, API integration |
| **AI/ML Engineer** | AI pipeline (OpenAI, ElevenLabs), voice cloning, story generation, illustration generation, prompt engineering |
| **Designer** | Visual identity, brand guidelines, UI/UX, logo, color system, typography, illustrations |
| **Lead** | Project management, task planning, delegation, review |

---

## Live Site Preview

> **https://4497395f80d7bf602e6505d07bcfa780.ctonew.app**

This is the current development preview (served from port 3000). For the production deployment, run `bun run go-live` which deploys to a Vercel URL and can be pointed to a custom domain.

### Current Pages

| Route | Page | Auth Required |
|-------|------|:---:|
| `/` | Landing page with interactive story demo | No |
| `/pricing` | Pricing plans | No |
| `/signup` | Sign up (Clerk) | No |
| `/login` | Log in (Clerk) | No |
| `/privacy` | Privacy Policy | No |
| `/terms` | Terms of Service | No |
| `/cookies` | Cookie Policy | No |
| `/dashboard` | Dashboard home | Yes |
| `/dashboard/voice` | Voice recording flow | Yes |
| `/dashboard/library` | Story library | Yes |
| `/dashboard/settings` | Child preferences + account | Yes |

---

## Documentation Index

| Document | Path | Purpose |
|----------|------|---------|
| **Project README** | `README.md` | This document — project overview and entry point |
| **Site Docs** | `site/SITE.md` | Site-specific architecture and conventions |
| **Pipeline Getting Started** | `pipeline/GETTING_STARTED.md` | Step-by-step AI pipeline setup |
| **Go-Live Checklist** | `docs/go-live-checklist.md` | Production launch checklist |
| **Environment Variables** | `site/.env.example` | All env vars with descriptions |
| **Business Plan** | *(team board)* | Value proposition, target customers, KPIs |

---

*Built by the CorbaTales team. Every night, a new story.* 🌙✨
