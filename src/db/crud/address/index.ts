import { and, eq, inArray, type SQL } from 'drizzle-orm';
import type { Json } from 'drizzle-typebox';
import type { SupportedLanguage } from '../../../i18n/config';
import type { AddressFiltersSchema } from '../../../modules/addresses/schemas';
import type {
    PaginatedResponse,
    PaginationQuerySchema,
} from '../../../schema/pagination';
import { db } from '../../index';
import {
    address,
    type TranslatedField,
    translatedFields,
} from '../../schema/address';
import { applyModelTranslations, selectTranslationColumns } from '../helpers';

export interface GetAddressesOptions {
    pagination?: PaginationQuerySchema;
    filters?: AddressFiltersSchema;
    languages?: readonly SupportedLanguage[];
}

export interface GetPaginatedAddresses
    extends Omit<GetAddressesOptions, 'pagination'> {
    pagination?: PaginationQuerySchema;
}

export type AddressSelect = Awaited<ReturnType<typeof getAddresses>>[number];

export async function getAddresses({
    pagination = {},
    filters,
    languages,
}: GetAddressesOptions = {}) {
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
            kind: address.kind,
            coordinates: address.point,
            path: address.path,
            raw: address.raw,
            ...selectTranslationColumns(address, translatedFields, languages),
        })
        .from(address);

    if (whereClause) {
        query.where(whereClause);
    }

    query.limit(limit);
    query.offset(offset);

    const results = await query;

    const translated = applyModelTranslations<
        (typeof results)[number],
        TranslatedField
    >(results, {
        fields: translatedFields,
        languages,
    });

    return translated.map((result) => {
        // Parallel transformations for better performance
        const [coordinates, location] = [
            // Transform coordinates
            result.coordinates
                ? {
                      latitude: result.coordinates.y,
                      longitude: result.coordinates.x,
                  }
                : null,
            // Transform location objects in parallel
            Array.isArray(result.location)
                ? result.location.map((item: Record<string, unknown>) => {
                      if (item && typeof item === 'object' && 'url_root' in item) {
                          const { url_root, ...rest } = item;
                          return { ...rest, urlRoot: url_root };
                      }
                      return item;
                  })
                : result.location,
        ];

        return {
            ...result,
            coordinates,
            location: location as Json,
            urlRoot: result.urlRoot as Json,
            raw: result.raw as Json,
        };
    });
}

export async function getPaginatedAddresses({
    pagination,
    filters,
    languages,
}: GetPaginatedAddresses = {}): Promise<PaginatedResponse<AddressSelect>> {
    const { limit = 24, offset = 0 } = pagination || {};

    // Get one extra item to determine if there's a next page
    const extraLimit = limit + 1;

    const results = await getAddresses({
        pagination: { limit: extraLimit, offset },
        filters,
        languages,
    });

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
