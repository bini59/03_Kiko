#!/usr/bin/env bash
set -euo pipefail

# Kiko Self-Hosted GitHub Actions Runner Setup (ARM64)
# Run this once on the deployment server.

echo "=== Kiko Self-Hosted Runner Setup ==="
echo ""
echo "Prerequisites:"
echo "  - Docker installed and running"
echo "  - GitHub repo access with admin permissions"
echo ""

# 1. Create Docker network
echo "[1/4] Creating Docker network..."
docker network create kiko-network 2>/dev/null && echo "  Created kiko-network" || echo "  kiko-network already exists"

# 2. Create initial upstream.conf
PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
UPSTREAM_CONF="$PROJECT_DIR/nginx/upstream.conf"

if [[ ! -f "$UPSTREAM_CONF" ]]; then
    echo "[2/4] Creating initial upstream.conf..."
    cat > "$UPSTREAM_CONF" <<'EOF'
upstream kiko_backend {
    server kiko-blue:3000;
}
EOF
    echo "  Created $UPSTREAM_CONF (default: blue)"
else
    echo "[2/4] upstream.conf already exists, skipping"
fi

# 3. Start nginx
echo "[3/4] Starting nginx container..."
cd "$PROJECT_DIR"
docker compose up -d nginx
echo "  nginx started on port 3010"

# 4. Runner installation instructions
echo ""
echo "[4/4] GitHub Actions Runner Installation"
echo "========================================="
echo ""
echo "1. Go to: https://github.com/<owner>/<repo>/settings/actions/runners/new"
echo "2. Select: Linux, ARM64"
echo "3. Follow the download & configure steps"
echo "4. Configure with label: kiko"
echo "   ./config.sh --url https://github.com/<owner>/<repo> --token <TOKEN> --labels kiko"
echo "5. Install as service:"
echo "   sudo ./svc.sh install"
echo "   sudo ./svc.sh start"
echo ""
echo "After runner is set up:"
echo "  1. Add YOUTUBE_API_KEY to GitHub Secrets"
echo "  2. Create .env.production: cp .env.production.example .env.production"
echo "  3. Merge dev → main to trigger first deployment"
echo ""
echo "=== Setup complete ==="
