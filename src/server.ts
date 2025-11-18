import { opentelemetry } from '@elysiajs/opentelemetry';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { Elysia } from 'elysia';
import { instrumentation } from './instrumentation';
import { addresses } from './modules/addresses';
import { language } from './plugins/language';
import { sentry } from './plugins/sentry';

new Elysia()
    .use(instrumentation)
    .use(
        opentelemetry({
            serviceName: 'sputnik-api',
            spanProcessors: [
                new BatchSpanProcessor(
                    new OTLPTraceExporter({
                        url: 'http://localhost:4318/v1/traces',
                    }),
                ),
            ],
        }),
    )
    .use(sentry())
    .use(language)
    .use(addresses)
    .listen(3001);
