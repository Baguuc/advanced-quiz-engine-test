FROM node:24-alpine AS build

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY apps/frontend/package.json apps/frontend/package.json
COPY packages/common/package.json packages/common/package.json
RUN pnpm install --frozen-lockfile --filter backend... --filter frontend...

COPY apps/backend apps/backend
COPY apps/frontend apps/frontend
COPY packages/common packages/common

ARG APP_URL
ENV VITE_API_URL=${APP_URL}
ENV VITE_RPC_PATH=rpc
ENV VITE_AUTH_PATH=/auth
RUN test -n "$APP_URL" \
    || (echo "APP_URL must be set to the public app origin" >&2 && exit 1)
RUN pnpm --filter backend exec tsc --noEmit false --outDir dist \
    && pnpm --filter frontend build

FROM node:24-alpine AS runtime

WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache nginx supervisor \
    && corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/backend/package.json apps/backend/package.json
COPY packages/common/package.json packages/common/package.json
RUN pnpm install --prod --frozen-lockfile --filter backend...

COPY --from=build /app/apps/backend/dist apps/backend/dist
COPY --from=build /app/packages/common packages/common
COPY --from=build /app/apps/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY supervisord.conf /etc/supervisord.conf
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN tr -d '\r' < /usr/local/bin/docker-entrypoint.sh > /tmp/docker-entrypoint.sh \
    && mv /tmp/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
