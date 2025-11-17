import { and, eq, inArray, type SQL } from 'drizzle-orm';
import type {
    PaginatedResponse,
    PaginationQuerySchema,
} from '../../../schema/pagination';
import { db } from '../../index';
import { address } from '../../schema/address';

export interface GetPaginatedAddresses {
    pagination?: PaginationQuerySchema;
    filters?: {
        id?: number;
        id__in?: number[];
    };
}

export type AddressSelect = Awaited<ReturnType<typeof getAddresses>>[number];

export async function getAddresses(
    pagination: PaginationQuerySchema = {},
    filters?: { id?: number; id__in?: number[] },
) {
    const { limit = 24, offset = 0 } = pagination;

    let whereClause: SQL<unknown> | undefined;

    if (filters?.id || filters?.id__in) {
        const conditions = [];

        if (filters.id !== undefined) {
            conditions.push(eq(address.id, filters.id));
        } else if (filters.id__in !== undefined && filters.id__in.length > 0) {
            conditions.push(inArray(address.id, filters.id__in));
        }

        whereClause =
            conditions.length > 1 ? and(...conditions) : conditions[0];
    }

    const query = db
        .select({
            id: address.id,
            name: address.name,
            description: address.description,
            kind: address.kind,
            coordinates: address.point,
            formatted: address.formatted,
            path: address.path,
            location: address.location,
            slug: address.slug,
            url: address.url,
            urlRoot: address.urlRoot,
            raw: address.raw,
        })
        .from(address);

    if (whereClause) {
        query.where(whereClause);
    }

    query.limit(limit);
    query.offset(offset);

    const results = await query;

    return results.map((result) => {
        const coordinates = result.coordinates
            ? {
                  latitude: result.coordinates.y,
                  longitude: result.coordinates.x,
              }
            : null;

        return {
            ...result,
            coordinates,
        };
    });
}

export async function getPaginatedAddresses({
    pagination,
    filters,
}: GetPaginatedAddresses): Promise<PaginatedResponse<AddressSelect>> {
    const { limit = 24, offset = 0 } = pagination || {};

    // Get one extra item to determine if there's a next page
    const extraLimit = limit + 1;

    const results = await getAddresses({ limit: extraLimit, offset }, filters);

    // Check if there's a next page
    const hasNext = results.length > limit;

    // Remove the extra item if it exists
    const actualResults = hasNext ? results.slice(0, -1) : results;

    // Determine pagination links
    const hasPrevious = offset > 0;

    const next = hasNext
        ? {
              limit,
              offset: offset + limit,
          }
        : null;

    const previous = hasPrevious
        ? {
              limit,
              offset: Math.max(0, offset - limit),
          }
        : null;

    return {
        next,
        previous,
        results: actualResults,
    };
}
