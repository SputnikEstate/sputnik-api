import { Elysia } from 'elysia';
import { instrumentation } from './instrumentation';
import { addresses } from './modules/addresses';
import { language } from './plugins/language';
import { sentry } from './plugins/sentry';

new Elysia()
    .use(instrumentation)
    .use(sentry())
    .use(language)
    .use(addresses)
    .listen(3001);
