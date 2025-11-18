import { opentelemetry } from '@elysiajs/opentelemetry';
import * as Sentry from '@sentry/bun';
import { Elysia } from 'elysia';

export function sentry(options?: Sentry.BunOptions) {
    const dsn = options?.dsn ?? Bun.env.SENTRY_DSN;
    if (!dsn) return;

    const environment = options?.environment ?? Bun.env.SENTRY_ENVIRONMENT;

    Sentry.init({
        dsn,
        environment,
        integrations: [Sentry.bunServerIntegration()],
        tracesSampleRate: 1.0,
        ...options,
    });

    return new Elysia()
        .decorate('Sentry', Sentry)
        .use(opentelemetry())
        .onError(
            { as: 'global' },
            function captureException({ error, Sentry }) {
                Sentry.captureException(error);
            },
        );
}
