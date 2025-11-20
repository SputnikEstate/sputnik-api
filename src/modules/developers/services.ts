import {
    getDevelopers as getDevelopersCrud,
    getPaginatedDevelopers as getPaginatedDevelopersCrud,
} from '../../db/crud/developer';
import type { DeveloperFiltersSchema, QuerySchema } from './schemas';

interface GetDevelopersProps {
    query: QuerySchema;
}

export const getDevelopers = async ({ query }: GetDevelopersProps) => {
    const filters: DeveloperFiltersSchema = {};

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
        return await getDevelopersCrud({
            filters: Object.keys(filters).length > 0 ? filters : undefined,
        });
    }

    return await getPaginatedDevelopersCrud({
        pagination: { limit: query.limit, offset: query.offset },
        filters: Object.keys(filters).length > 0 ? filters : undefined,
    });
};
