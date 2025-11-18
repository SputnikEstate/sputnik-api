FROM oven/bun AS build

WORKDIR /app

COPY package.json package.json
COPY bun.lock bun.lock

RUN bun install

COPY ./src ./src

RUN curl -sfS https://dotenvx.sh/install.sh | sh

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
