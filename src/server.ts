import { Elysia } from 'elysia';
import { instrumentation } from './instrumentation';
import { addresses } from './modules/addresses';
import { developers } from './modules/developers';
import { sentry } from './plugins/sentry';

new Elysia()
    .use(sentry())
    .use(instrumentation)
    .use(addresses)
    .use(developers)
    .listen(3001);
