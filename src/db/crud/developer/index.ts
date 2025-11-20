import { record } from '@elysiajs/opentelemetry';
import { and, eq, inArray, type SQL } from 'drizzle-orm';
import type { DeveloperFiltersSchema } from '../../../modules/developers/schemas';
import type {
    PaginatedResponse,
    PaginationQuerySchema,
} from '../../../schema/pagination';
import { db } from '../../index';
import { developer } from '../../schema/developer';
import { createPaginatedResponse } from '../helpers';

export interface GetDevelopersOptions {
    pagination?: PaginationQuerySchema;
    filters?: DeveloperFiltersSchema;
}

export interface GetPaginatedDevelopers
    extends Omit<GetDevelopersOptions, 'pagination'> {
    pagination?: PaginationQuerySchema;
}

export type DeveloperSelect = Awaited<ReturnType<typeof getDevelopers>>[number];

export async function getDevelopers({
    pagination = {},
    filters,
}: GetDevelopersOptions = {}) {
    let limit: number;

    if (pagination.limit !== undefined) {
        limit = pagination.limit || 24;
    } else if (filters?.id__in && filters.id__in.length > 0) {
        limit = filters.id__in.length;
    } else {
        limit = 24;
    }

    const offset = pagination.offset || 0;

    let whereClause: SQL<unknown> | undefined;

    if (filters?.id || filters?.id__in) {
        const conditions = [];

        if (filters.id !== undefined) {
            conditions.push(eq(developer.id, filters.id));
        } else if (filters.id__in !== undefined && filters.id__in.length > 0) {
            conditions.push(inArray(developer.id, filters.id__in));
        }

        whereClause =
            conditions.length > 1 ? and(...conditions) : conditions[0];
    }

    const query = db
        .select({
            id: developer.id,
            name: developer.name,
            logo: developer.logo,
            slug: developer.slug,
        })
        .from(developer);

    if (whereClause) {
        query.where(whereClause);
    }

    query.limit(limit);
    query.offset(offset);

    const results = await record('database.query', () => query);

    return results.map((result) => ({
        ...result,
        logo: result.logo ? `https://storage.sputnik.estate/${result.logo}` : null,
    }));
}

export async function getPaginatedDevelopers({
    pagination,
    filters,
}: GetPaginatedDevelopers = {}): Promise<PaginatedResponse<DeveloperSelect>> {
    const { limit = 24, offset = 0 } = pagination || {};

    const extraLimit = limit + 1;

    const results = await getDevelopers({
        pagination: { limit: extraLimit, offset },
        filters,
    });

    return createPaginatedResponse(results, limit, offset);
}
