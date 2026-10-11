# Build
FROM node:24-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html ./
COPY vite.config.mjs ./
COPY src ./src
COPY public ./public
RUN npm run build

# Serve the static build as an unprivileged user.
FROM node:24-bookworm-slim AS runtime
WORKDIR /app
ENV NODE_ENV=production PORT=3000
RUN npm install --global --omit=dev serve@14.2.6 \
  && npm cache clean --force
COPY --from=build --chown=node:node /app/dist ./dist
USER node
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
