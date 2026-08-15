# TAS §9.1 stage 8 — "tsup bundle per package + Docker image build".
# Two-stage build: the builder installs the frozen lockfile and runs `pnpm exec tsup`
# (bare, via the root tsup.config.ts entry map); the slim runtime image carries only
# the bundled output. Postgres stays external (Neon at runtime) — this image is the
# governance-api process and its inlined packages.
#
# NOTE (2026-08-12): main.ts is still a source stub, so the image builds and the
# container starts but does nothing yet. Revisit the CMD when the app source is
# implemented (next phase).

FROM node:22-alpine AS builder
RUN npm install -g pnpm@10.17.1
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile && pnpm exec tsup

FROM node:22-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/dist ./dist
# ESM bundle (tsup emits .mjs for format: "esm")
CMD ["node", "/app/dist/governance-api.mjs"]