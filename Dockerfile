FROM oven/bun AS build

WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src

# Install curl and dotenvx, then ensure it's in /usr/local/bin
RUN apt-get update && apt-get install -y curl && \
    curl -sfS https://dotenvx.sh/install.sh | sh && \
    (which dotenvx > /dev/null && cp $(which dotenvx) /usr/local/bin/dotenvx || \
    find /root -name dotenvx -type f -executable -exec cp {} /usr/local/bin/dotenvx \; 2>/dev/null || true) && \
    chmod +x /usr/local/bin/dotenvx && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

RUN bun build \
    --compile \
    --minify-whitespace \
    --minify-syntax \
    --outfile server \
    src/index.ts

FROM gcr.io/distroless/base

WORKDIR /app

COPY --from=build /app/server server
COPY --from=build /usr/local/bin/dotenvx /usr/local/bin/dotenvx

COPY .env .env

ENV NODE_ENV=production

EXPOSE 3000

CMD ["dotenvx", "run", "--", "./server"]
