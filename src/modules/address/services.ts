import { getPaginatedAddresses as getPaginatedAddressesCrud } from '../../db/crud/address';
import type { SupportedLanguage } from '../../i18n/config';
import type { QuerySchema } from './schemas';

interface GetAddressesProps {
    query: QuerySchema;
    preferredLanguages: SupportedLanguage[];
}

interface AddressesFilters {
    id?: number;
    id__in?: number[];
}

export const getAddresses = async ({
    query,
    preferredLanguages,
}: GetAddressesProps) => {
    const filters: AddressesFilters = {};

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
        preferredLanguages,
    });

    return result;
};
