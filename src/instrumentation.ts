import { opentelemetry } from '@elysiajs/opentelemetry';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';
import { PgInstrumentation } from '@opentelemetry/instrumentation-pg';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-node';

export const instrumentation = opentelemetry({
    serviceName: 'sputnik-api',
    instrumentations: [new PgInstrumentation()],
    spanProcessors: [
        new BatchSpanProcessor(
            new OTLPTraceExporter({
                url: 'http://localhost:4318/v1/traces',
            }),
        ),
        new BatchSpanProcessor(
				new OTLPTraceExporter({
					url: 'https://api.axiom.co/v1/traces', 
					headers: {
						Authorization: `Bearer ${Bun.env.AXIOM_TOKEN!}`, 
						'X-Axiom-Dataset': Bun.env.AXIOM_DATASET!
					} 
				})
			)
    ],
});
