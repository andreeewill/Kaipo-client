# syntax=docker/dockerfile:1.7
################################################################################
# Kaipo Client — Production-optimized Dockerfile (Next.js + pnpm)
# - Multi-stage build with cached dependency graph (pnpm fetch)
# - Small Alpine runtime, non-root user, and proper signal handling via tini
# - Optimized for Next.js static exports and standalone builds
################################################################################

# ---------- Base image with pnpm enabled ----------
FROM node:lts-alpine AS base

ARG BUILDPLATFORM
ARG TARGETPLATFORM
ARG PNPM_VERSION=9.12.0

ENV PNPM_HOME="/pnpm" \
	PATH="/pnpm:$PATH"

# Enable pnpm via Corepack and pin the version for reproducibility
RUN corepack enable \
 	&& corepack prepare pnpm@${PNPM_VERSION} --activate

WORKDIR /app


# ---------- Dependencies layer (maximizes build cache) ----------
FROM base AS deps

# Only copy lockfile + manifest first to maximize caching
COPY package.json pnpm-lock.yaml ./

# Pre-fetch all deps (incl. dev) into the store based solely on lockfile
# This avoids re-resolving when app sources change
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store pnpm fetch --store-dir=/pnpm-store


# ---------- Build stage ----------
FROM base AS build

# System deps for potential native modules (safe no-op if unused)
RUN apk add --no-cache --virtual .build-deps python3 make g++

# Reuse the fetched store for a fast, offline install
COPY package.json pnpm-lock.yaml ./
## Ensure the store contains all tarballs for this platform (multi-arch safe)
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store pnpm fetch --store-dir=/pnpm-store
RUN --mount=type=cache,id=pnpm-store,target=/pnpm-store pnpm install --offline --store-dir=/pnpm-store

# Bring in the full application source
COPY . .

# Accept build arguments for Next.js environment variables
ARG NEXT_PUBLIC_API_BASE_URL=https://apiuat.kaipo.my.id
ARG NEXT_PUBLIC_APP_NAME=Kaipo

# Set build-time environment variables for Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME

# Build Next.js application
RUN pnpm build

# Produce production-only node_modules to minimize runtime size
RUN pnpm prune --prod


# ---------- Runtime stage ----------
FROM node:lts-alpine AS runner

# Install tini for proper PID 1 signal handling and zombie reaping
RUN apk add --no-cache tini

ENV NODE_ENV=production \
	NEXT_TELEMETRY_DISABLED=1 \
	PORT=3000

WORKDIR /app

# Create and use a non-root user before copying files so we can chown on copy
RUN addgroup -S nodejs && adduser -S nodejs -G nodejs

# OCI image labels (filled via build-args in CI)
ARG VERSION="0.0.0"
ARG REVISION="unknown"
ARG BUILD_DATE
LABEL org.opencontainers.image.title="Kaipo Client" \
	org.opencontainers.image.description="Kaipo frontend application" \
	org.opencontainers.image.version="$VERSION" \
	org.opencontainers.image.revision="$REVISION" \
	org.opencontainers.image.created="$BUILD_DATE" \
	org.opencontainers.image.source="https://github.com/andreeewill/Kaipo-client"

# Copy only what the app needs at runtime
COPY --chown=nodejs:nodejs --from=build /app/package.json ./package.json
COPY --chown=nodejs:nodejs --from=build /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --chown=nodejs:nodejs --from=build /app/node_modules ./node_modules
COPY --chown=nodejs:nodejs --from=build /app/.next ./.next
COPY --chown=nodejs:nodejs --from=build /app/public ./public

# Copy Next.js config files if they exist
COPY --chown=nodejs:nodejs --from=build /app/next.config.* ./

USER nodejs

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]

CMD ["npm", "start"]