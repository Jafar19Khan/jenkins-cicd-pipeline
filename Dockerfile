# ---- Jenkins demo app image ----
FROM node:24-alpine

ENV NODE_ENV=production
WORKDIR /app

# Copy package files first so that this layer is cached when only code changes
COPY package*.json ./
RUN npm install --omit=dev --no-audit --no-fund

# Copy the application code
COPY server.js ./

# Run as the non-root user that comes with the node image
USER node

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "server.js"]
