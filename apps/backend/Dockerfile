FROM node:24-alpine AS build

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/common/package.json packages/common/package.json
RUN pnpm install --frozen-lockfile --filter backend...

COPY apps/backend apps/backend
COPY packages/common packages/common
RUN pnpm --filter backend exec tsc --noEmit false --outDir dist

FROM node:24-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
ENV APP_PORT=3000
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/common/package.json packages/common/package.json
RUN pnpm install --prod --frozen-lockfile --filter backend...

COPY --from=build /app/apps/backend/dist apps/backend/dist
COPY --from=build /app/packages/common packages/common

WORKDIR /app/apps/backend
EXPOSE 3000
CMD ["node", "dist/src/index.js"]