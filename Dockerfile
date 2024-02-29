FROM node:20.11.1 AS build

RUN groupadd -g 999 nodejs && useradd -u 999 -g 999 nodejs

RUN apt-get update
RUN apt-get upgrade -y
RUN apt-get install -y --no-install-recommends \
    apt-transport-https \
    ca-certificates \
    curl \
    git
RUN rm -rf /var/lib/apt/lists/*

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

########################################

# Production image omits dev dependencies and is much smaller

FROM node:20.11.1-slim AS prod

RUN groupadd -g 999 nodejs && useradd -u 999 -g 999 nodejs

RUN apt-get update && \
		apt-get upgrade -y && \
		apt-get clean && \
		rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist

USER nodejs
ENV NODE_ENV=production
ENV HOST=0.0.0.0
EXPOSE 3000
CMD ["node", "dist/serve.js"]
