import { Elysia } from 'elysia';
import type { LanguageContext } from './i18n/config';
import { instrumentation } from './instrumentation';
import { querySchema, responseSchema } from './modules/addresses/schemas';
import { getAddresses } from './modules/addresses/services';
import { language } from './plugins/language';
import { sentry } from './plugins/sentry';

new Elysia()
    .use(instrumentation)
    .use(sentry())
    .use(language)
    .get(
        '/api/addresses',
        async (ctx) => {
            const { query, languages } = ctx as typeof ctx & LanguageContext;

            return await getAddresses({ query, languages });
        },
        {
            query: querySchema,
            response: {
                200: responseSchema,
            },
        },
    )
    .listen(3001);
