#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────────────────────────
# CorbaTales AI Pipeline — Setup & Sanity Test
# ─────────────────────────────────────────────────────────────────────────────
# This script:
#   1. Checks Python 3.10+ is installed
#   2. Installs required Python packages
#   3. Verifies both API keys (OPENAI_API_KEY, ELEVENLABS_API_KEY)
#   4. Tests the OpenAI API connection
#   5. Tests the ElevenLabs API connection
#   6. Runs the pipeline demo mode
#   7. Prints a summary
#
# Usage:
#   bash setup.sh
# ─────────────────────────────────────────────────────────────────────────────

PIPELINE_DIR="$(cd "$(dirname "$0")" && pwd)"
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
PASS=0
FAIL=0
WARN=0

print_header() {
    echo ""
    echo "================================================"
    echo "  CorbaTales AI Pipeline — Setup & Sanity Test"
    echo "================================================"
    echo ""
}

check() {
    local name="$1"
    local status="$2"
    if [ "$status" = "pass" ]; then
        echo -e "  ${GREEN}✅${NC} $name"
        PASS=$((PASS + 1))
    elif [ "$status" = "fail" ]; then
        echo -e "  ${RED}❌${NC} $name"
        FAIL=$((FAIL + 1))
    else
        echo -e "  ${YELLOW}⚠️  ${NC} $name"
        WARN=$((WARN + 1))
    fi
}

print_header

# ─── 1. Check Python ────────────────────────────────────────────────────────
echo -e "${BLUE}[1/7] Checking Python...${NC}"
if command -v python3 &>/dev/null; then
    PY_VERSION=$(python3 --version 2>&1 | grep -oP '\d+\.\d+')
    PY_MAJOR=$(echo "$PY_VERSION" | cut -d. -f1)
    PY_MINOR=$(echo "$PY_VERSION" | cut -d. -f2)
    if [ "$PY_MAJOR" -ge 3 ] && [ "$PY_MINOR" -ge 10 ]; then
        check "Python $PY_VERSION found" "pass"
    else
        check "Python $PY_VERSION found (3.10+ recommended)" "warn"
    fi
else
    check "python3 not found" "fail"
    echo "  Install Python 3.10+ from https://python.org"
fi

# ─── 2. Install Python packages ─────────────────────────────────────────────
echo ""
echo -e "${BLUE}[2/7] Installing Python packages...${NC}"
if command -v pip3 &>/dev/null; then
    pip3 install --quiet --break-system-packages requests 2>/dev/null && \
        check "requests package installed" "pass" || \
        check "requests package install failed" "fail"
else
    check "pip3 not found" "fail"
fi

# ─── 3. Check API keys ──────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}[3/7] Checking API keys...${NC}"

if [ -n "${OPENAI_API_KEY:-}" ]; then
    KEY_LEN=${#OPENAI_API_KEY}
    if [ "$KEY_LEN" -gt 20 ]; then
        check "OPENAI_API_KEY is set (${KEY_LEN} chars)" "pass"
    else
        check "OPENAI_API_KEY looks too short (${KEY_LEN} chars)" "warn"
    fi
else
    check "OPENAI_API_KEY is not set" "warn"
    echo "  Set it: export OPENAI_API_KEY=sk-..."
fi

if [ -n "${ELEVENLABS_API_KEY:-}" ]; then
    KEY_LEN=${#ELEVENLABS_API_KEY}
    if [ "$KEY_LEN" -gt 10 ]; then
        check "ELEVENLABS_API_KEY is set (${KEY_LEN} chars)" "pass"
    else
        check "ELEVENLABS_API_KEY looks too short (${KEY_LEN} chars)" "warn"
    fi
else
    check "ELEVENLABS_API_KEY is not set" "warn"
    echo "  Set it: export ELEVENLABS_API_KEY=..."
fi

# ─── 4. Test OpenAI API ─────────────────────────────────────────────────────
echo ""
echo -e "${BLUE}[4/7] Testing OpenAI API...${NC}"
if [ -n "${OPENAI_API_KEY:-}" ]; then
    OPENAI_TEST=$(curl -s -o /dev/null -w "%{http_code}" \
        https://api.openai.com/v1/models \
        -H "Authorization: Bearer $OPENAI_API_KEY" \
        --max-time 10 2>/dev/null || echo "000")
    if [ "$OPENAI_TEST" = "200" ]; then
        check "OpenAI API connection successful" "pass"
    elif [ "$OPENAI_TEST" = "401" ]; then
        check "OpenAI API: Unauthorized (invalid key)" "fail"
        echo "  Regenerate your key at https://platform.openai.com/api-keys"
    else
        check "OpenAI API: HTTP $OPENAI_TEST" "warn"
        echo "  Check your key and network connection"
    fi
else
    check "Skipping OpenAI test (no key)" "warn"
fi

# ─── 5. Test ElevenLabs API ─────────────────────────────────────────────────
echo ""
echo -e "${BLUE}[5/7] Testing ElevenLabs API...${NC}"
if [ -n "${ELEVENLABS_API_KEY:-}" ]; then
    ELEVEN_TEST=$(curl -s -o /dev/null -w "%{http_code}" \
        https://api.elevenlabs.io/v1/voices \
        -H "xi-api-key: $ELEVENLABS_API_KEY" \
        --max-time 10 2>/dev/null || echo "000")
    if [ "$ELEVEN_TEST" = "200" ]; then
        check "ElevenLabs API connection successful" "pass"
    elif [ "$ELEVEN_TEST" = "401" ]; then
        check "ElevenLabs API: Unauthorized (invalid key)" "fail"
        echo "  Regenerate your key at https://elevenlabs.io/app/settings/api-keys"
    else
        check "ElevenLabs API: HTTP $ELEVEN_TEST" "warn"
        echo "  Check your key and network connection"
    fi
else
    check "Skipping ElevenLabs test (no key)" "warn"
fi

# ─── 6. Run pipeline demo ───────────────────────────────────────────────────
echo ""
echo -e "${BLUE}[6/7] Running pipeline demo...${NC}"
if [ -f "$PIPELINE_DIR/pipeline.py" ]; then
    DEMO_OUTPUT=$(python3 "$PIPELINE_DIR/pipeline.py" demo 2>&1) && \
        check "Pipeline demo runs successfully" "pass" || \
        check "Pipeline demo failed" "fail"
    # Check for key content in the demo output
    if echo "$DEMO_OUTPUT" | grep -q "Luna and the Star-Seed Garden"; then
        check "Demo story content verified" "pass"
    else
        check "Demo story content check" "warn"
    fi
else
    check "pipeline.py not found at $PIPELINE_DIR" "fail"
fi

# ─── 7. Check pipeline directory ────────────────────────────────────────────
echo ""
echo -e "${BLUE}[7/7] Checking pipeline artifacts...${NC}"
for f in "ARCHITECTURE.md" "API_ENDPOINTS.md" "pipeline.py" "pipeline.ts" "server-functions.ts" "GETTING_STARTED.md"; do
    if [ -f "$PIPELINE_DIR/$f" ]; then
        check "$f exists" "pass"
    else
        check "$f missing" "warn"
    fi
done

# ─── Summary ─────────────────────────────────────────────────────────────────
echo ""
echo "================================================"
echo -e "  ${GREEN}Results:${NC} $PASS passed, $FAIL failed, $WARN warnings"
echo "================================================"

if [ "$FAIL" -gt 0 ]; then
    echo ""
    echo -e "${RED}Some checks failed. Fix the issues above and re-run.${NC}"
    echo ""
    exit 1
elif [ "$WARN" -gt 0 ]; then
    echo ""
    echo -e "${YELLOW}All checks passed with warnings. Review above.${NC}"
    echo ""
    exit 0
else
    echo ""
    echo -e "${GREEN}All checks passed! Pipeline is ready to use.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Run a full story: cd $PIPELINE_DIR && python3 pipeline.py generate --name 'Luna' --age 5 --interests 'dinosaurs, space' --themes 'magic, adventure'"
    echo "  2. Voice cloning:  python3 pipeline.py clone-voice --audio sample.mp3 --name 'My Voice'"
    echo "  3. Open the guide: cat $PIPELINE_DIR/GETTING_STARTED.md"
    echo ""
    exit 0
fi