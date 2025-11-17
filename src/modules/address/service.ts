import { getPaginatedAddresses as getPaginatedAddressesCrud } from '../../db/crud/address';
import type { QuerySchema } from './schema';

export const getAddresses = async ({ query }: { query: QuerySchema }) => {
    const filters: { id?: number; id__in?: number[] } = {};

    if (query.id !== undefined) {
        filters.id = query.id;
    }

    if (query.id__in !== undefined) {
        filters.id__in = query.id__in
            .split(',')
            .map((id: string) => parseInt(id.trim(), 10))
            .filter((id: number) => !Number.isNaN(id));
    }

    const result = await getPaginatedAddressesCrud({
        pagination: { limit: query.limit, offset: query.offset },
        filters: Object.keys(filters).length > 0 ? filters : undefined,
    });
    return result;
};
