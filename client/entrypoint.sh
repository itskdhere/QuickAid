#!/bin/sh
set -e

# Replace environment variables in the Nginx configuration template
envsubst '$$PORT $$CORS_ORIGIN' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

# Start Nginx
exec nginx -g 'daemon off;'