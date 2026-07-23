"""
CorbaTales AI Pipeline — Prototype
====================================
Demonstrates the full pipeline:
  1. Voice Cloning (ElevenLabs) — from a 3-min audio sample
  2. Story Generation (OpenAI GPT-4o mini) — personalized bedtime story
  3. Illustration Generation (DALL-E 3) — story illustration
  4. Text-to-Speech (ElevenLabs) — narrated in the cloned voice

Usage:
  export OPENAI_API_KEY=sk-...
  export ELEVENLABS_API_KEY=...
  
  # Full pipeline (generate a story)
  python3 pipeline.py generate --name "Luna" --age 5 --interests "dinosaurs, space" --themes "magic, adventure"
  
  # Clone a voice
  python3 pipeline.py clone-voice --audio /path/to/sample.mp3 --name "Mom's Voice"
"""

import argparse
import json
import os
import sys
import time
import uuid
from datetime import datetime
from pathlib import Path
from typing import Optional

import requests


# ─── Configuration ───────────────────────────────────────────────────────────

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "")
ELEVENLABS_API_KEY = os.environ.get("ELEVENLABS_API_KEY", "")

OPENAI_MODEL_STORY = "gpt-4o-mini"
OPENAI_MODEL_IMAGE = "dall-e-3"
ELEVENLABS_VOICE_MODEL = "eleven_turbo_v2_5"

# Output directory for generated artifacts
OUTPUT_DIR = Path("./corba-output")
OUTPUT_DIR.mkdir(exist_ok=True)

# Cost tracking
COST_LOG = []


# ─── Utility ─────────────────────────────────────────────────────────────────

def log(msg: str):
    print(f"[{datetime.now().strftime('%H:%M:%S')}] {msg}")

def track_cost(component: str, cost: float):
    COST_LOG.append({"component": component, "cost": cost})
    log(f"  💰 {component}: ${cost:.4f}")

def check_api_keys():
    if not OPENAI_API_KEY:
        log("⚠️  OPENAI_API_KEY not set. Run: export OPENAI_API_KEY=sk-...")
        return False
    if not ELEVENLABS_API_KEY:
        log("⚠️  ELEVENLABS_API_KEY not set. Run: export ELEVENLABS_API_KEY=...")
        return False
    return True


# ─── 1. Voice Cloning (ElevenLabs) ──────────────────────────────────────────

def clone_voice(audio_path: str, voice_name: str) -> Optional[str]:
    """
    Clone a voice from a 3-minute audio sample using ElevenLabs.
    Returns the voice_id (string) or None on failure.
    """
    log(f"🎤 Cloning voice from: {audio_path}")
    log(f"   Voice name: {voice_name}")

    if not Path(audio_path).exists():
        log(f"❌ Audio file not found: {audio_path}")
        return None

    url = "https://api.elevenlabs.io/v1/voices/add"
    headers = {"xi-api-key": ELEVENLABS_API_KEY}

    with open(audio_path, "rb") as f:
        files = {
            "files": (Path(audio_path).name, f, "audio/mpeg"),
        }
        data = {
            "name": voice_name,
            "labels": json.dumps({"source": "corba-recording", "type": "parent"}),
            "description": "Voice cloned for CorbaTales bedtime stories",
        }

        try:
            resp = requests.post(url, headers=headers, files=files, data=data, timeout=120)
            resp.raise_for_status()
            result = resp.json()
            voice_id = result.get("voice_id")
            log(f"✅ Voice cloned! Voice ID: {voice_id}")
            track_cost("Voice Cloning (ElevenLabs)", 5.00)  # one-time setup
            return voice_id
        except requests.exceptions.RequestException as e:
            log(f"❌ Voice cloning failed: {e}")
            if hasattr(e, "response") and e.response is not None:
                log(f"   Response: {e.response.text}")
            return None


# ─── 2. Story Generation (OpenAI GPT-4o mini) ────────────────────────────────

def generate_story(
    name: str,
    age: int,
    interests: str,
    themes: str,
    characters: str = "",
    setting: str = "",
    special_element: str = "",
) -> Optional[dict]:
    """
    Generate a personalized bedtime story using GPT-4o mini.
    Returns a dict with title, story_text, scene_descriptions, moral, word_count.
    """
    log(f"📖 Generating story for {name} (age {age})...")
    log(f"   Interests: {interests}")
    log(f"   Themes: {themes}")

    # Build age-appropriate constraints
    if age <= 3:
        word_target = "300-400 words"
        vocab = "simple, repetitive, soothing"
    elif age <= 6:
        word_target = "400-600 words"
        vocab = "descriptive but accessible"
    else:
        word_target = "500-800 words"
        vocab = "rich vocabulary, more complex plot"

    system_prompt = """You are CorbaTales, an AI bedtime story generator for children ages 2-10.
You create unique, warm, and engaging stories that are:
- Age-appropriate (vocabulary, themes, length)
- Positive and uplifting (gentle lessons, happy endings)
- Imaginative but coherent (logical plot within the story world)
- Culturally inclusive and diverse

Rules:
- Stories must be 400-800 words
- Always include a gentle moral or lesson
- Create 3-5 scene descriptions for illustration prompts
- Never include scary or violent content
- The protagonist should be relatable to the child
- Use warm, descriptive language
- Output in JSON format only, no markdown fences"""

    user_prompt = f"""Generate a unique bedtime story with these details:

Child's name: {name}
Age: {age}
Interests: {interests}
Favorite themes: {themes}
Favorite characters/animals: {characters or "Any friendly animal"}
Setting preference: {setting or "A cozy magical world"}
Today's special element: {special_element or "A gentle surprise"}

Writing style: {vocab}
Target length: {word_target}

Output ONLY valid JSON (no markdown, no code fences):
{{
  "title": "The story title",
  "story_text": "Full story text...",
  "scene_descriptions": [
    "Description of scene 1 for illustration",
    "Description of scene 2 for illustration",
    "Description of scene 3 for illustration"
  ],
  "moral": "The gentle lesson of the story",
  "word_count": 523
}}"""

    try:
        resp = requests.post(
            "https://api.openai.com/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": OPENAI_MODEL_STORY,
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                "temperature": 0.85,
                "max_tokens": 2000,
                "response_format": {"type": "json_object"},
            },
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()

        # Cost calculation (GPT-4o mini: $0.15/1M input, $0.60/1M output)
        usage = data.get("usage", {})
        input_tokens = usage.get("prompt_tokens", 0)
        output_tokens = usage.get("completion_tokens", 0)
        cost = (input_tokens / 1_000_000 * 0.15) + (output_tokens / 1_000_000 * 0.60)
        track_cost("Story Generation (GPT-4o mini)", cost)

        content = data["choices"][0]["message"]["content"]
        story = json.loads(content)

        log(f"✅ Story generated: \"{story.get('title', 'Untitled')}\"")
        log(f"   Word count: {story.get('word_count', 'N/A')}")

        # Save story to file
        story_file = OUTPUT_DIR / f"story_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        with open(story_file, "w") as f:
            json.dump(story, f, indent=2)
        log(f"   Saved to: {story_file}")

        return story

    except requests.exceptions.RequestException as e:
        log(f"❌ Story generation failed: {e}")
        if hasattr(e, "response") and e.response is not None:
            log(f"   Response: {e.response.text}")
        return None
    except json.JSONDecodeError as e:
        log(f"❌ Failed to parse story JSON: {e}")
        return None


# ─── 3. Illustration Generation (DALL-E 3) ──────────────────────────────────

def generate_illustration(scene_description: str, age_range: str = "4-8") -> Optional[str]:
    """
    Generate an illustration for a story scene using DALL-E 3.
    Returns the image URL (string) or None on failure.
    """
    log(f"🎨 Generating illustration for scene...")
    log(f"   Scene: {scene_description[:80]}...")

    prompt = (
        f"Children's book illustration style. {scene_description}. "
        f"Warm, soft colors. Friendly characters. "
        f"Age-appropriate for children {age_range}. "
        f"Digital illustration style, cozy bedtime aesthetic. "
        f"No text in the image."
    )

    try:
        resp = requests.post(
            "https://api.openai.com/v1/images/generations",
            headers={
                "Authorization": f"Bearer {OPENAI_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": OPENAI_MODEL_IMAGE,
                "prompt": prompt,
                "n": 1,
                "size": "1024x1024",
                "quality": "standard",
                "style": "vivid",
            },
            timeout=30,
        )
        resp.raise_for_status()
        data = resp.json()

        # Cost: $0.04 per standard 1024x1024 DALL-E 3 image
        track_cost("Illustration (DALL-E 3)", 0.04)

        image_url = data["data"][0]["url"]
        log(f"✅ Illustration generated!")

        # Download and save the image locally
        img_resp = requests.get(image_url, timeout=30)
        img_resp.raise_for_status()
        img_file = OUTPUT_DIR / f"illustration_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
        with open(img_file, "wb") as f:
            f.write(img_resp.content)
        log(f"   Saved to: {img_file}")

        return str(img_file)

    except requests.exceptions.RequestException as e:
        log(f"❌ Illustration generation failed: {e}")
        if hasattr(e, "response") and e.response is not None:
            log(f"   Response: {e.response.text}")
        return None


# ─── 4. Text-to-Speech (ElevenLabs) ─────────────────────────────────────────

def generate_narration(story_text: str, voice_id: str) -> Optional[str]:
    """
    Convert story text to speech using ElevenLabs with a cloned voice.
    Returns the audio file path or None on failure.
    """
    log(f"🔊 Generating narration with voice ID: {voice_id}...")

    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {
        "xi-api-key": ELEVENLABS_API_KEY,
        "Content-Type": "application/json",
    }
    payload = {
        "text": story_text,
        "model_id": ELEVENLABS_VOICE_MODEL,
        "voice_settings": {
            "stability": 0.5,
            "similarity_boost": 0.75,
            "style": 0.3,
            "use_speaker_boost": True,
        },
    }

    try:
        resp = requests.post(url, headers=headers, json=payload, timeout=60)
        resp.raise_for_status()

        # Calculate cost: $0.08 per 1K characters for Turbo model
        char_count = len(story_text)
        cost = (char_count / 1000) * 0.08
        track_cost("TTS (ElevenLabs Turbo)", cost)

        # Save audio
        audio_file = OUTPUT_DIR / f"narration_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp3"
        with open(audio_file, "wb") as f:
            f.write(resp.content)
        log(f"✅ Narration generated! ({char_count} chars, {audio_file.stat().st_size / 1024:.1f} KB)")
        log(f"   Saved to: {audio_file}")

        return str(audio_file)

    except requests.exceptions.RequestException as e:
        log(f"❌ Narration generation failed: {e}")
        if hasattr(e, "response") and e.response is not None:
            log(f"   Response: {e.response.text}")
        return None


# ─── 5. Full Pipeline ───────────────────────────────────────────────────────

def run_full_pipeline(
    child_name: str,
    age: int,
    interests: str,
    themes: str,
    characters: str = "",
    setting: str = "",
    special_element: str = "",
    voice_id: Optional[str] = None,
) -> Optional[dict]:
    """
    Run the complete story generation pipeline:
    1. Generate story → 2. Generate illustration → 3. Generate narration
    """
    log("=" * 60)
    log("🚀 CORBATALES — Full Pipeline")
    log("=" * 60)

    # Step 1: Generate story
    story = generate_story(name=child_name, age=age, interests=interests,
                           themes=themes, characters=characters, setting=setting,
                           special_element=special_element)
    if not story:
        log("❌ Pipeline failed at story generation step")
        return None

    # Step 2: Generate illustration (for the first scene)
    if story.get("scene_descriptions") and len(story["scene_descriptions"]) > 0:
        scene = story["scene_descriptions"][0]
        image_path = generate_illustration(scene, age_range=f"{age-1}-{age+2}")
        if image_path:
            story["image_path"] = image_path
    else:
        log("   ⚠️ No scene descriptions to illustrate")

    # Step 3: Generate narration
    if voice_id:
        audio_path = generate_narration(story["story_text"], voice_id)
        if audio_path:
            story["audio_path"] = audio_path
    else:
        log("   ⚠️ No voice_id provided — skipping narration")

    # Summary
    print()
    log("=" * 60)
    log("📊 PIPELINE SUMMARY")
    log("=" * 60)
    log(f"   Title:      {story.get('title', 'N/A')}")
    log(f"   Words:      {story.get('word_count', 'N/A')}")
    log(f"   Moral:      {story.get('moral', 'N/A')}")
    log(f"   Image:      {'✅' if story.get('image_path') else '❌'}")
    log(f"   Audio:      {'✅' if story.get('audio_path') else '❌'}")
    log("-" * 60)
    total_cost = sum(c["cost"] for c in COST_LOG)
    log(f"   💰 Total cost: ${total_cost:.4f}")
    for c in COST_LOG:
        log(f"      {c['component']}: ${c['cost']:.4f}")
    log("=" * 60)

    # Save full result
    result_file = OUTPUT_DIR / "pipeline_result.json"
    with open(result_file, "w") as f:
        json.dump({"story": story, "cost_log": COST_LOG, "total_cost": total_cost}, f, indent=2)
    log(f"   Full result saved to: {result_file}")

    return story


# ─── CLI ─────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="CorbaTales AI Pipeline — Prototype",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")

    # Generate command
    gen_parser = subparsers.add_parser("generate", help="Generate a new bedtime story")
    gen_parser.add_argument("--name", required=True, help="Child's name")
    gen_parser.add_argument("--age", type=int, required=True, help="Child's age")
    gen_parser.add_argument("--interests", required=True, help="Comma-separated interests")
    gen_parser.add_argument("--themes", required=True, help="Favorite themes")
    gen_parser.add_argument("--characters", default="", help="Favorite characters/animals")
    gen_parser.add_argument("--setting", default="", help="Setting preference")
    gen_parser.add_argument("--special", default="", help="A special element for today's story")
    gen_parser.add_argument("--voice-id", default="", help="ElevenLabs voice ID for narration")

    # Clone voice command
    clone_parser = subparsers.add_parser("clone-voice", help="Clone a voice from audio sample")
    clone_parser.add_argument("--audio", required=True, help="Path to 3-min audio sample file")
    clone_parser.add_argument("--name", default="Parent Voice", help="Name for the voice model")

    # Demonstrate command (no API keys needed)
    demo_parser = subparsers.add_parser("demo", help="Run a demo with sample data (no API calls)")

    args = parser.parse_args()

    if args.command == "generate":
        if not check_api_keys():
            sys.exit(1)
        run_full_pipeline(
            child_name=args.name,
            age=args.age,
            interests=args.interests,
            themes=args.themes,
            characters=args.characters,
            setting=args.setting,
            special_element=args.special,
            voice_id=args.voice_id or None,
        )

    elif args.command == "clone-voice":
        if not ELEVENLABS_API_KEY:
            log("⚠️  ELEVENLABS_API_KEY not set")
            sys.exit(1)
        clone_voice(args.audio, args.name)

    elif args.command == "demo" or not args.command:
        # Demo mode: simulate the pipeline (no API calls)
        log("=" * 60)
        log("🎭 CORBATALES — Demo Mode (no API calls)")
        log("=" * 60)
        log("")
        log("This is what a CorbaTales story looks like:")
        log("")
        log("─" * 60)

        # Generate a sample story inline
        story = {
            "title": "Luna and the Star-Seed Garden",
            "story_text": (
                "In a cozy little house nestled between rolling hills, there lived a curious "
                "five-year-old girl named Luna who loved dinosaurs and the stars more than "
                "anything in the world. Every night, she would look out her window and wonder "
                "if the dinosaurs who once ruled the Earth ever looked up at the very same stars.\n\n"
                "One night, as Luna was drifting off to sleep, a tiny, glowing pebble floated "
                "through her window and landed softly on her blanket. It shimmered with colors "
                "she had never seen before — a warm golden light mixed with a gentle blue. "
                "\"Oh!\" Luna whispered, picking it up carefully. The pebble was warm, like "
                "a tiny piece of sunshine.\n\n"
                "Suddenly, the pebble began to glow brighter, and from it emerged a small, "
                "friendly dinosaur. But this was no ordinary dinosaur — it was made of starlight! "
                "Its scales sparkled like tiny constellations, and its eyes were kind and wise. "
                "\"Hello, Luna,\" said the stardust dinosaur in a soft, crinkly voice. \"I am "
                "Orion, a Star-Seed Guardian. I have come to take you on a very special journey.\"\n\n"
                "Luna's eyes grew wide with wonder. \"A journey? Where?\" she asked. Orion smiled "
                "and took her tiny hand in his gentle claw. \"To the Star-Seed Garden, where the "
                "most magical plants in the universe grow. Each seed we plant becomes a new star "
                "in the night sky.\"\n\n"
                "They floated up through the window, higher and higher, until the house below "
                "looked like a tiny toy. Luna laughed with delight as they soared past fluffy "
                "clouds and through a shimmering curtain of northern lights. Finally, they arrived "
                "at a magnificent garden floating among the stars.\n\n"
                "In the Star-Seed Garden, there were flowers that chimed like wind chimes, "
                "trees with leaves made of soft moonlight, and tiny fairies tending to "
                "glowing seed pods. Each pod contained a brand-new star, waiting to be "
                "planted in the sky.\n\n"
                "\"Would you like to plant a star?\" Orion asked. Luna nodded eagerly. She "
                "chose a seed pod that glowed with a warm, golden light — just like the "
                "pebble that had found her. Together, they planted it in the soft, sparkly "
                "soil. As soon as the seed was covered, a brilliant beam of light shot up "
                "into the darkness, and there, twinkling brightly, was a brand-new star.\n\n"
                "\"That star is special,\" Orion said. \"It's a wishing star. Whenever you "
                "look up at it, remember that you can grow anything — kindness, courage, "
                "and dreams — just like we grow stars here.\"\n\n"
                "Luna hugged Orion goodbye and floated back down to her bed. The next morning, "
                "she looked out her window and saw the gentle glow of the wishing star, still "
                "shining even in the daylight. And from that night on, Luna knew that even "
                "the biggest dreams start from the smallest seeds — and that a little bit of "
                "magic lives in every night sky, waiting for someone to believe."
            ),
            "scene_descriptions": [
                "A cozy bedroom at night with a little girl looking out the window at a starry sky. A tiny glowing pebble floats through the window. Soft moonlight, warm colors.",
                "A stardust dinosaur made of constellations emerges from a glowing pebble. The dinosaur has kind eyes and sparkly scales, standing on a child's bed. Magical atmosphere.",
                "A little girl and a stardust dinosaur floating through a shimmering curtain of northern lights. The house below looks tiny. Stars and colorful aurora fill the sky.",
                "A magical floating garden among the stars, with glowing flowers that chime, trees with moonlit leaves, and tiny fairies tending to glowing seed pods. Cozy, dreamy colors.",
                "A little girl hugging a stardust dinosaur in a star-filled garden, with a single bright golden star shining above them. Warm, emotional, bedtime aesthetic.",
            ],
            "moral": "Even the biggest dreams start from the smallest seeds — believe in the magic of kindness, courage, and imagination.",
            "word_count": 612,
        }

        log(f"📖 \"{story['title']}\"")
        log(f"   Words: {story['word_count']}")
        log(f"  Moral: {story['moral']}")
        log("")
        log("─" * 60)
        log("Story text:")
        log("─" * 60)
        log(story["story_text"][:500] + "...")
        log("")
        log("─" * 60)
        log("🎨 Scene descriptions (for illustration):")
        for i, scene in enumerate(story["scene_descriptions"], 1):
            log(f"   {i}. {scene}")
        log("")
        log("─" * 60)
        log("💰 Estimated cost (with real APIs):")
        log("   Story generation (GPT-4o mini):      $0.001")
        log("   Illustration (DALL-E 3, 1 image):    $0.040")
        log("   TTS (ElevenLabs Turbo, ~600 words):  $0.100")
        log("   ─────────────────────────────────────")
        log("   Total per story:                     $0.141")
        log("")
        log("   At 30 stories/month per subscriber:")
        log("   30 × $0.14 = $4.22/subscriber/month")
        log("   Revenue: $12.99/mo → Gross margin: $8.77 (67%)")
        log("")
        log("─" * 60)
        log("🚀 To run with real APIs:")
        log("   export OPENAI_API_KEY=sk-...")
        log("   export ELEVENLABS_API_KEY=...")
        log("   python3 pipeline.py \\")
        log("     generate --name 'Luna' --age 5 \\")
        log("     --interests 'dinosaurs, space' --themes 'magic, adventure'")
        log("=" * 60)


if __name__ == "__main__":
    main()