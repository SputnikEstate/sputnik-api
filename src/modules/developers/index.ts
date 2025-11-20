import { Elysia } from 'elysia';
import { querySchema, responseSchema } from './schemas';
import { getDevelopers as getDevelopersService } from './services';

export const developers = new Elysia({ prefix: '/api/developers' }).get(
    '/',
    async function getDevelopers({ query }) {
        return await getDevelopersService({ query });
    },
    {
        query: querySchema,
        response: {
            200: responseSchema,
        },
    },
);
