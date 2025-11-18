import { Elysia } from 'elysia';
import type { LanguageContext } from '../../i18n/config';
import { querySchema, responseSchema } from './schemas';
import { getAddresses } from './services';

export const address = new Elysia({ prefix: '/api/address' }).get(
    '/',
    async (ctx) => {
        const { query, preferredLanguages } = ctx as typeof ctx &
            LanguageContext;

        return await getAddresses({ query, preferredLanguages });
    },
    {
        query: querySchema,
        response: {
            200: responseSchema,
        },
    },
);
