#!/bin/sh
set -eu

: "${APP_URL:?APP_URL is required}"
: "${AUTH_SECRET:?AUTH_SECRET is required}"
: "${DATABASE_URL:?DATABASE_URL is required}"

export APP_PORT=3000
export APP_BASE_URL="$APP_URL"
export CORS_TRUSTED_ORIGIN="$APP_URL"
export BETTER_AUTH_SECRET="$AUTH_SECRET"
export BETTER_AUTH_PATH=auth
export ORPC_PATH=rpc

exec /usr/bin/supervisord -c /etc/supervisord.conf
