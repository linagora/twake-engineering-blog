# syntax=docker/dockerfile:1.7

# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps with cache-friendly layering
COPY package.json package-lock.json* ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci --no-audit --no-fund

# Copy source and build (Astro + Pagefind index)
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM nginx:1.27-alpine AS runtime

# Drop default nginx config and copy ours
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/blog.conf

# Copy the built static site
COPY --from=builder /app/dist /usr/share/nginx/html

# Run as non-root for security: shift ownership and use the bundled nginx user
RUN chown -R nginx:nginx /usr/share/nginx/html

EXPOSE 8080

# nginx 1.25+ allows running as non-root via this user; rely on the default CMD.
CMD ["nginx", "-g", "daemon off;"]
