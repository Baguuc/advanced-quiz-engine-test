FROM node:24-alpine AS build

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/frontend/package.json apps/frontend/package.json
COPY apps/backend/package.json apps/backend/package.json
COPY packages/common/package.json packages/common/package.json
RUN pnpm install --frozen-lockfile --filter frontend...

COPY apps/frontend apps/frontend
COPY apps/backend apps/backend
COPY packages/common packages/common

ARG VITE_API_URL
ARG VITE_RPC_PATH
ARG VITE_AUTH_PATH
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_RPC_PATH=${VITE_RPC_PATH}
ENV VITE_AUTH_PATH=${VITE_AUTH_PATH}
RUN pnpm --filter frontend build

FROM nginx:alpine AS runtime

COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html

EXPOSE 80