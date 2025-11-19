import { Elysia } from 'elysia';
import type { LanguageContext } from '../../i18n/config';
import { querySchema, responseSchema } from './schemas';
import { getAddresses } from './services';

export const addresses = new Elysia({ prefix: '/api/addresses' }).get(
    '',
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
);
