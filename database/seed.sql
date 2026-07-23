-- ============================================================================
-- CorbaTales Database Seed — Sample Data
-- ============================================================================
-- Run: psql $DATABASE_URL -f seed.sql
-- This populates the database with realistic sample data for testing & demos.
-- All UUIDs are deterministic for repeatable seeding.
-- ============================================================================

-- ─── Sample Users ───────────────────────────────────────────────────────────

INSERT INTO users (id, email, clerk_id, name, avatar_url) VALUES
  (
    'a1000000-0000-0000-0000-000000000001',
    'sarah.johnson@example.com',
    'user_2NNNNNNNNNNNNNNNNNNNNNN',
    'Sarah Johnson',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=128'
  ),
  (
    'a1000000-0000-0000-0000-000000000002',
    'michael.rodriguez@example.com',
    'user_2MMMMMMMMMMMMMMM',
    'Michael Rodriguez',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=128'
  ),
  (
    'a1000000-0000-0000-0000-000000000003',
    'patricia.lee@example.com',
    'user_2LLLLLLLLLLLLLLL',
    'Patricia Lee',
    'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=128'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Sample Subscriptions ───────────────────────────────────────────────────

INSERT INTO subscriptions (
  id, user_id, stripe_customer_id, stripe_subscription_id,
  plan_type, status,
  current_period_start, current_period_end,
  stories_generated_this_period
) VALUES
  (
    'b2000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'cus_QBwX9ABCDEFGHIJK',
    'sub_1ABCDEFGHIJKLMNOP',
    'annual', 'active',
    '2026-07-01 00:00:00+00', '2027-07-01 00:00:00+00',
    12
  ),
  (
    'b2000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000002',
    'cus_QBwX9KLMNOPQRSTU',
    'sub_1KLMNOPQRSTUVWXY',
    'monthly', 'active',
    '2026-07-15 00:00:00+00', '2026-08-15 00:00:00+00',
    5
  ),
  (
    'b2000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000003',
    'cus_QBwX9UVWXYZABCDE',
    'sub_1UVWXYZABCDEFGHI',
    'gift_annual', 'active',
    '2026-06-01 00:00:00+00', '2027-06-01 00:00:00+00',
    28
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Sample User Voices ─────────────────────────────────────────────────────

INSERT INTO user_voices (id, user_id, elevenlabs_voice_id, voice_name, voice_sample_url) VALUES
  (
    'c3000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    '21m00Tcm4TlvDq8ikWAM',
    'Sarah''s Warm Voice',
    'https://cdn.corbatales.com/samples/sarah-voice.mp3'
  ),
  (
    'c3000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000002',
    '29vD33N1CtxCmqQRP5cC',
    'Dad''s Bedtime Voice',
    'https://cdn.corbatales.com/samples/michael-voice.mp3'
  ),
  (
    'c3000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000003',
    'MF3mGyEYCl7XYWbV9V6O',
    'Grandma Pat''s Voice',
    'https://cdn.corbatales.com/samples/patricia-voice.mp3'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Sample Child Profiles ──────────────────────────────────────────────────

INSERT INTO child_profiles (id, user_id, name, age, interests, themes, characters, settings, voice_id) VALUES
  -- Sarah's children
  (
    'd4000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'Luna', 5,
    '{"dinosaurs","space","dancing"}',
    '{"magic","adventure","friendship"}',
    '{"rabbits","unicorns"}',
    '{"forest","space"}',
    'c3000000-0000-0000-0000-000000000001'
  ),
  (
    'd4000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000001',
    'Leo', 3,
    '{"dinosaurs","trucks","robots"}',
    '{"adventure","magic"}',
    '{"dinosaurs","dragons"}',
    '{"jungle","ocean"}',
    'c3000000-0000-0000-0000-000000000001'
  ),
  -- Michael's child
  (
    'd4000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000002',
    'Nova', 7,
    '{"space","princesses","robots"}',
    '{"magic","friendship","adventure"}',
    '{"princesses","dragons"}',
    '{"space","castle"}',
    'c3000000-0000-0000-0000-000000000002'
  ),
  -- Patricia's grandchild
  (
    'd4000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000003',
    'Oliver', 4,
    '{"animals","ocean","knights"}',
    '{"adventure","magic"}',
    '{"dragons","foxes"}',
    '{"ocean","forest"}',
    'c3000000-0000-0000-0000-000000000003'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Sample Stories ─────────────────────────────────────────────────────────

INSERT INTO stories (
  id, user_id, child_profile_id, title, story_text,
  scene_descriptions, moral, word_count, estimated_duration_seconds,
  image_url, audio_url,
  pipeline_metadata, listened_count, is_favorite, generated_at
) VALUES
  -- Luna's stories (Sarah's child, age 5)
  (
    'e5000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'd4000000-0000-0000-0000-000000000001',
    'Luna and the Star-Seed Garden',
    'In a cozy little house nestled between rolling hills, there lived a curious five-year-old girl named Luna who loved dinosaurs and the stars more than anything in the world. Every night, she would look out her window and wonder...',
    '["A cozy bedroom at night with a little girl looking out the window at a starry sky. A tiny glowing pebble floats through the window.","A stardust dinosaur made of constellations emerges from a glowing pebble. The dinosaur has kind eyes and sparkly scales.","A little girl and a stardust dinosaur floating through a shimmering curtain of northern lights. The house below looks tiny."]',
    'Even the biggest dreams start from the smallest seeds — believe in the magic of kindness, courage, and imagination.',
    510, 240,
    'https://cdn.corbatales.com/stories/luna-star-seed.png',
    'https://cdn.corbatales.com/stories/luna-star-seed.mp3',
    '{"story_model":"gpt-4o-mini","story_tokens_in":850,"story_tokens_out":700,"story_cost":0.001,"image_model":"dall-e-3","image_cost":0.04,"tts_model":"eleven_turbo_v2_5","tts_chars":2500,"tts_cost":0.08,"voice_id":"21m00Tcm4TlvDq8ikWAM","generation_duration_ms":8500,"used_fallback":false}',
    3, TRUE, '2026-07-16 19:30:00+00'
  ),
  (
    'e5000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000001',
    'd4000000-0000-0000-0000-000000000001',
    'Luna''s Dinosaur Dance Party',
    'Luna loved two things: dinosaurs and dancing. So when she found a magical dance floor in her backyard that made toy dinosaurs come to life and dance along with her, it was the best day ever. Together they boogied under the moonlight...',
    '["A girl dancing in her backyard under the moonlight. Toy dinosaurs are scattered around.","The toy dinosaurs magically come to life and start dancing with the girl. Colorful glow around them.","The girl and dinosaurs forming a conga line. Fireflies light up the scene."]',
    'Joy is contagious — share your happiness and the whole world dances with you.',
    380, 180,
    'https://cdn.corbatales.com/stories/luna-dino-dance.png',
    'https://cdn.corbatales.com/stories/luna-dino-dance.mp3',
    '{"story_model":"gpt-4o-mini","story_tokens_in":700,"story_tokens_out":520,"story_cost":0.001,"image_model":"dall-e-3","image_cost":0.04,"tts_model":"eleven_turbo_v2_5","tts_chars":1900,"tts_cost":0.06,"voice_id":"21m00Tcm4TlvDq8ikWAM","generation_duration_ms":7200,"used_fallback":false}',
    2, TRUE, '2026-07-17 19:30:00+00'
  ),
  -- Leo's story (Sarah's other child, age 3)
  (
    'e5000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000001',
    'd4000000-0000-0000-0000-000000000002',
    'Leo''s Big Red Truck',
    'Leo had a big red truck that could go anywhere — through the jungle, over mountains, and even into space! One day, his truck broke down, and Leo had to use his tools to fix it. With a little patience and lots of vroom-vrooms...',
    '["A little boy with a red toy truck in a jungle setting. Colorful birds and trees.","The boy using toy tools to fix his truck. A friendly monkey watches.","The fixed truck driving through space with stars and planets. The boy is smiling."]',
    'When something breaks, you can always fix it — and sometimes the fixing is the most fun part.',
    290, 130,
    'https://cdn.corbatales.com/stories/leo-red-truck.png',
    'https://cdn.corbatales.com/stories/leo-red-truck.mp3',
    '{"story_model":"gpt-4o-mini","story_tokens_in":550,"story_tokens_out":400,"story_cost":0.001,"image_model":"dall-e-3","image_cost":0.04,"tts_model":"eleven_turbo_v2_5","tts_chars":1400,"tts_cost":0.04,"voice_id":"21m00Tcm4TlvDq8ikWAM","generation_duration_ms":6800,"used_fallback":false}',
    1, FALSE, '2026-07-18 19:30:00+00'
  ),
  -- Nova's story (Michael's child, age 7)
  (
    'e5000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000002',
    'd4000000-0000-0000-0000-000000000003',
    'The Robot Princess of Mars',
    'Nova lived on Mars, where she was both a princess and a robot engineer. When the Martian flowers wouldn''t bloom, Nova built a team of tiny robot gardeners. Together, they discovered that the flowers needed not just water and sun, but music and laughter too...',
    '["A princess in a workshop on Mars, wearing a crown and holding a wrench. Robots and tools around her.","The princess and her tiny robot gardeners working on a garden of silver flowers. Red Martian landscape.","The Martian flowers blooming with colorful lights. The princess and robots celebrating."]',
    'The best inventions come from the heart — mix a little science with a lot of love.',
    420, 200,
    'https://cdn.corbatales.com/stories/nova-robot-princess.png',
    'https://cdn.corbatales.com/stories/nova-robot-princess.mp3',
    '{"story_model":"gpt-4o-mini","story_tokens_in":780,"story_tokens_out":600,"story_cost":0.001,"image_model":"dall-e-3","image_cost":0.04,"tts_model":"eleven_turbo_v2_5","tts_chars":2100,"tts_cost":0.07,"voice_id":"29vD33N1CtxCmqQRP5cC","generation_duration_ms":8000,"used_fallback":false}',
    5, TRUE, '2026-07-17 20:00:00+00'
  ),
  -- Oliver's story (Patricia's grandchild, age 4)
  (
    'e5000000-0000-0000-0000-000000000005',
    'a1000000-0000-0000-0000-000000000003',
    'd4000000-0000-0000-0000-000000000004',
    'Oliver and the Ocean''s Secret',
    'Oliver loved the beach. One day, he found a shimmering seashell that whispered secrets about an underwater kingdom. A friendly sea turtle named Tully took him on a journey through coral castles, where he met a mermaid who taught him the ocean''s greatest secret...',
    '["A boy on a beach holding a glowing seashell to his ear. The ocean sparkles.","The boy riding a friendly sea turtle through colorful coral. Fish swim around them.","The boy meeting a mermaid in an underwater castle made of coral and pearls."]',
    'The ocean''s greatest secret is that every drop of water is connected — just like every act of kindness connects us all.',
    360, 170,
    'https://cdn.corbatales.com/stories/oliver-ocean.png',
    'https://cdn.corbatales.com/stories/oliver-ocean.mp3',
    '{"story_model":"gpt-4o-mini","story_tokens_in":680,"story_tokens_out":510,"story_cost":0.001,"image_model":"dall-e-3","image_cost":0.04,"tts_model":"eleven_turbo_v2_5","tts_chars":1800,"tts_cost":0.06,"voice_id":"MF3mGyEYCl7XYWbV9V6O","generation_duration_ms":7400,"used_fallback":false}',
    4, TRUE, '2026-07-18 20:00:00+00'
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Sample Generation Logs ─────────────────────────────────────────────────

INSERT INTO generation_logs (
  id, user_id, story_id, child_profile_id,
  started_at, completed_at, total_duration_ms,
  story_success, story_model, story_tokens_in, story_tokens_out, story_cost,
  image_success, image_model, image_cost,
  tts_success, tts_model, tts_chars, tts_cost,
  used_fallback, total_cost
) VALUES
  (
    'f6000000-0000-0000-0000-000000000001',
    'a1000000-0000-0000-0000-000000000001',
    'e5000000-0000-0000-0000-000000000001',
    'd4000000-0000-0000-0000-000000000001',
    '2026-07-16 19:30:00+00', '2026-07-16 19:30:08+00', 8500,
    TRUE, 'gpt-4o-mini', 850, 700, 0.001,
    TRUE, 'dall-e-3', 0.04,
    TRUE, 'eleven_turbo_v2_5', 2500, 0.08,
    FALSE, 0.121
  ),
  (
    'f6000000-0000-0000-0000-000000000002',
    'a1000000-0000-0000-0000-000000000001',
    'e5000000-0000-0000-0000-000000000002',
    'd4000000-0000-0000-0000-000000000001',
    '2026-07-17 19:30:00+00', '2026-07-17 19:30:07+00', 7200,
    TRUE, 'gpt-4o-mini', 700, 520, 0.001,
    TRUE, 'dall-e-3', 0.04,
    TRUE, 'eleven_turbo_v2_5', 1900, 0.06,
    FALSE, 0.101
  ),
  -- A failed generation (rate limit example)
  (
    'f6000000-0000-0000-0000-000000000003',
    'a1000000-0000-0000-0000-000000000002',
    NULL,
    'd4000000-0000-0000-0000-000000000003',
    '2026-07-17 20:05:00+00', '2026-07-17 20:05:02+00', 2000,
    FALSE, 'gpt-4o-mini', 780, 0, 0,
    FALSE, NULL, 0,
    FALSE, NULL, 0, 0,
    TRUE, 0,
    'rate_limit', '429 Too Many Requests — OpenAI rate limit exceeded', 3
  ),
  -- A partial failure (DALL-E content policy)
  (
    'f6000000-0000-0000-0000-000000000004',
    'a1000000-0000-0000-0000-000000000003',
    NULL,
    'd4000000-0000-0000-0000-000000000004',
    '2026-07-18 20:00:00+00', '2026-07-18 20:00:06+00', 6500,
    TRUE, 'gpt-4o-mini', 680, 510, 0.001,
    FALSE, 'dall-e-3', 0,
    TRUE, 'eleven_turbo_v2_5', 1800, 0.06,
    FALSE, 0.061,
    'content_policy', 'DALL-E content policy triggered — used fallback illustration', 0
  )
ON CONFLICT (id) DO NOTHING;

-- ─── Verify Seed Data ───────────────────────────────────────────────────────

-- Check row counts
SELECT 'users' as table_name, COUNT(*) FROM users
UNION ALL
SELECT 'subscriptions', COUNT(*) FROM subscriptions
UNION ALL
SELECT 'user_voices', COUNT(*) FROM user_voices
UNION ALL
SELECT 'child_profiles', COUNT(*) FROM child_profiles
UNION ALL
SELECT 'stories', COUNT(*) FROM stories
UNION ALL
SELECT 'generation_logs', COUNT(*) FROM generation_logs
ORDER BY table_name;