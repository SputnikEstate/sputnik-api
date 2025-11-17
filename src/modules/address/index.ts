import { Elysia } from 'elysia';
import { querySchema, responseSchema } from './schema';
import { getAddresses } from './service';

export const address = new Elysia({ prefix: '/api/address' }).get(
    '/',
    async ({ query }) => {
        return await getAddresses({ query });
    },
    {
        query: querySchema,
        response: {
            200: responseSchema,
        },
    },
);
