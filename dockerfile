# ==============================================================================
# ApniLeap Enterprise Smart File Backup Platform (RIT-CSE 2026)
# Multi-Stage Production Dockerfile
#
# Services Containerized:
#   - Team D React 18 SPA Frontend (Vite + Tailwind CSS on Port 5173)
#   - Team D Express.js Backend-For-Frontend & Socket.IO (Port 4000)
#   - Team A OS 3-Algorithm Process Scheduler (Embedded in BFF)
#   - Team B File System SHA-256 Deduplication & Merkle Tree (Embedded in BFF)
#   - Team C MongoDB Compass Metadata & Storage Pointer Client
# ==============================================================================

# ------------------------------------------------------------------------------
# STAGE 1: Frontend Builder
# ------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend dependency manifests
COPY frontend/package*.json ./

# Install frontend dependencies cleanly
RUN npm ci || npm install

# Copy frontend source files & configuration
COPY frontend/ ./

# Build optimized production bundle to /app/frontend/dist
RUN npm run build


# ------------------------------------------------------------------------------
# STAGE 2: Production Runtime
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runtime

# Install curl for container health checks and serve for single-page React app routing
RUN apk add --no-cache curl \
    && npm install -g serve@14.2.4

WORKDIR /app

# Set production environment variables
ENV NODE_ENV=production \
    PORT=4000 \
    MONGODB_URI=mongodb://127.0.0.1:27017/smart_file_backup

# 1. Copy Shared Contracts (Required by backend relative import ../../contracts)
COPY contracts/ /app/contracts/

# 2. Setup Backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy backend source tree
COPY backend/ ./

# Ensure physical storage directory for unique chunk blocks exists
RUN mkdir -p /app/backend/data/uploads/chunks

# 3. Setup Frontend Production Artifacts
WORKDIR /app
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# 4. Copy and setup startup entrypoint script
COPY entrypoint.sh /app/entrypoint.sh
# Fix Windows CRLF line endings to prevent Linux execution errors and grant exec permissions
RUN sed -i 's/\r$//' /app/entrypoint.sh \
    && chmod +x /app/entrypoint.sh

# Persistent storage volume for deduplicated chunk blocks
VOLUME ["/app/backend/data/uploads"]

# Expose Web UI (5173) and BFF REST / Socket.IO (4000)
EXPOSE 5173 4000

# Health check to ensure Backend API is responsive
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:4000/api/v1/ui/me || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
