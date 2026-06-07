FROM node:22-alpine AS base

WORKDIR /app

FROM base AS deps

COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
ENV NEXT_PUBLIC_BACKEND_URL=${NEXT_PUBLIC_BACKEND_URL}

RUN npm run build

FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000

RUN addgroup -S smarttriage && adduser -S smarttriage -G smarttriage

COPY --from=builder --chown=smarttriage:smarttriage /app/public ./public
COPY --from=builder --chown=smarttriage:smarttriage /app/.next/static ./.next/static
COPY --from=builder --chown=smarttriage:smarttriage /app/.next/standalone ./

USER smarttriage

EXPOSE 3000

CMD ["node", "server.js"]
