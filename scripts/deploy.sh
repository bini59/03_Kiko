#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
UPSTREAM_CONF="$PROJECT_DIR/nginx/upstream.conf"
IMAGE_NAME="kiko-app"
NETWORK_NAME="kiko-network"

log() { echo "[deploy] $(date '+%H:%M:%S') $*"; }

# Detect current active color from upstream.conf
get_active_color() {
    if [[ ! -f "$UPSTREAM_CONF" ]]; then
        echo "none"
        return
    fi
    if grep -q "kiko-blue" "$UPSTREAM_CONF"; then
        echo "blue"
    elif grep -q "kiko-green" "$UPSTREAM_CONF"; then
        echo "green"
    else
        echo "none"
    fi
}

# Health check: wait for container to respond
health_check() {
    local container_name="$1"
    local max_attempts=30
    local attempt=0

    log "Health check: $container_name (max ${max_attempts} attempts)"
    while [[ $attempt -lt $max_attempts ]]; do
        attempt=$((attempt + 1))
        if docker exec "$container_name" node -e "fetch('http://localhost:3000/').then(r=>{process.exit(r.ok?0:1)}).catch(()=>process.exit(1))" 2>/dev/null; then
            log "Health check passed (attempt $attempt)"
            return 0
        fi
        sleep 2
    done

    log "Health check FAILED after $max_attempts attempts"
    return 1
}

# Write upstream.conf pointing to specified color
set_upstream() {
    local color="$1"
    cat > "$UPSTREAM_CONF" <<EOF
upstream kiko_backend {
    server kiko-${color}:3000;
}
EOF
    log "Upstream set to kiko-${color}"
}

# Main deployment
main() {
    log "Starting deployment..."

    local active_color
    active_color=$(get_active_color)
    log "Current active: $active_color"

    # Determine new color
    local new_color
    if [[ "$active_color" == "blue" ]]; then
        new_color="green"
    else
        new_color="blue"
    fi
    log "Deploying to: $new_color"

    local new_container="kiko-${new_color}"
    local old_container="kiko-${active_color}"

    # Build image
    log "Building Docker image..."
    docker build -t "${IMAGE_NAME}:${new_color}" "$PROJECT_DIR"

    # Stop new-color container if it exists (from a previous failed deploy)
    docker rm -f "$new_container" 2>/dev/null || true

    # Start new container
    log "Starting $new_container..."
    docker run -d \
        --name "$new_container" \
        --network "$NETWORK_NAME" \
        --env-file "$PROJECT_DIR/.env.production" \
        --restart unless-stopped \
        "${IMAGE_NAME}:${new_color}"

    # Health check
    if ! health_check "$new_container"; then
        log "ROLLBACK: removing failed container $new_container"
        docker rm -f "$new_container" 2>/dev/null || true
        exit 1
    fi

    # Swap upstream
    set_upstream "$new_color"

    # Reload nginx
    if docker ps --format '{{.Names}}' | grep -q "kiko-nginx"; then
        docker exec kiko-nginx nginx -s reload
        log "Nginx reloaded"
    else
        log "WARNING: kiko-nginx not running. Start it with: docker compose up -d nginx"
    fi

    # Remove old container
    if [[ "$active_color" != "none" ]]; then
        log "Removing old container: $old_container"
        docker rm -f "$old_container" 2>/dev/null || true
    fi

    # Clean up old images
    docker image prune -f --filter "label=maintainer" 2>/dev/null || true

    log "Deployment complete! Active: $new_color"
}

main "$@"
