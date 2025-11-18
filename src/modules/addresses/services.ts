import {
    getAddresses as getAddressesCrud,
    getPaginatedAddresses as getPaginatedAddressesCrud,
} from '../../db/crud/address';
import type { SupportedLanguage } from '../../i18n/config';
import type { AddressFiltersSchema, QuerySchema } from './schemas';

interface GetAddressesProps {
    query: QuerySchema;
    languages: SupportedLanguage[];
}

export const getAddresses = async ({ query, languages }: GetAddressesProps) => {
    const filters: AddressFiltersSchema = {};

    if (query.id !== undefined) {
        filters.id = query.id;
    }

    if (query.id__in !== undefined) {
        filters.id__in = query.id__in
            .split(',')
            .map((id: string) => parseInt(id.trim(), 10))
            .filter((id: number) => !Number.isNaN(id));
    }

    if (query.pagination === 'flat') {
        return await getAddressesCrud({
            filters: Object.keys(filters).length > 0 ? filters : undefined,
            languages,
        });
    }

    return await getPaginatedAddressesCrud({
        pagination: { limit: query.limit, offset: query.offset },
        filters: Object.keys(filters).length > 0 ? filters : undefined,
        languages,
    });
};
