import { Elysia } from 'elysia';
import { language } from '../../plugins/language';
import { querySchema, responseSchema } from './schemas';
import { getAddresses as getAddressesService } from './services';

export const addresses = new Elysia({ prefix: '/api/addresses' })
    .use(language)
    .get(
        '/',
        async function getAddresses({ query, languages }) {
            return await getAddressesService({ query, languages });
        },
        {
            query: querySchema,
            response: {
                200: responseSchema,
            },
        },
    );
