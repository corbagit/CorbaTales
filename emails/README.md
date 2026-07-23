# CorbaTales Onboarding Email Sequence

5-email onboarding flow for new subscribers. Branded with the CorbaTales design system (midnight-blue, golden-amber, lavender-soft).

## Email Sequence

| # | File | Triggers When | Goal |
|---|------|--------------|------|
| 1 | `1-welcome.html` | Immediately after signup | Welcome, introduce the product, CTA: record voice |
| 2 | `2-voice-reminder.html` | 24h later if no voice recorded | Nudge to record, explain why voice matters |
| 3 | `3-first-story.html` | First story generated | Celebrate first story, CTA: listen now |
| 4 | `4-library-highlight.html` | 1 week / 7 stories reached | Show library growth, streaks, favorites |
| 5 | `5-book-upsell.html` | 2 weeks / 10+ favorites | Physical keepsake book upsell ($24.99 + Shipping &amp; Handling) |

## Template Variables

Each email uses Handlebars-style `{{variable}}` syntax. Fill these at send time:

| Variable | Used In | Description |
|----------|---------|-------------|
| `{{parent_name}}` | All | Parent's first name |
| `{{child_name}}` | 3, 4, 5 | Child's name |
| `{{dashboard_url}}` | 1, 2 | Link to user dashboard |
| `{{story_url}}` | 3 | Deep link to the generated story |
| `{{library_url}}` | 4 | Link to story library |
| `{{book_order_url}}` | 5 | Link to book order page |
| `{{story_title}}` | 3 | Title of generated story |
| `{{story_moral}}` | 3 | Moral/lesson from the story |
| `{{story_illustration_emoji}}` | 3 | Emoji for the illustration placeholder |
| `{{word_count}}` | 3 | Word count of the story |
| `{{story_count}}` | 4, 5 | Total stories generated |
| `{{streak_days}}` | 4 | Consecutive days with a story listen |
| `{{favorite_count}}` | 4 | Number of favorited stories |
| `{{listens_this_week}}` | 4 | Total listens this week |
| `{{favorite_1,2,3}}` | 5 | Top 3 favorite story titles |
| `{{account_settings_url}}` | All | Email preferences link |
| `{{unsubscribe_url}}` | All | Unsubscribe link |

## Brand Guidelines Applied

- **Background:** #1B1B3A (midnight-blue)
- **Primary accent:** #F5A623 (golden-amber) — for CTAs, highlights, key text
- **Secondary accent:** #C4A1E0 (lavender-soft) — for secondary highlights, cards
- **Tertiary accent:** #4ECDC4 (teal-calm) — for stats cards
- **Warm accent:** #FF6B6B (coral-soft) — for listens stat
- **Headings:** Playfair Display, Georgia serif
- **Body:** Nunito, Segoe UI, sans-serif
- **UI/Buttons:** Inter, Arial, sans-serif
- **Width:** 600px centered, border-radius: 16px cards

## Sending

These are HTML email templates. Use with your email provider (Resend, SendGrid, SES, etc.) by:
1. Replacing all `{{variables}}` with actual values
2. Inlining CSS (recommended for email client compatibility)
3. Sending through your transactional email API