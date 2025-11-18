import { t } from 'elysia';
import { spread } from '../../db/helpers';
import { address } from '../../db/schema/address';
import {
    createPaginatedResponseSchema,
    paginationQuerySchema,
} from '../../schema/pagination';

export const filtersQuerySchema = t.Object({
    id: t.Optional(t.Number()),
    id__in: t.Optional(t.String()),
});

export type FiltersQuerySchema = typeof filtersQuerySchema.static;

export const querySchema = t.Intersect([
    paginationQuerySchema,
    filtersQuerySchema,
]);

export type QuerySchema = typeof querySchema.static;

export const addressFiltersSchema = t.Object({
    id: t.Optional(t.Number()),
    id__in: t.Optional(t.Array(t.Number())),
});

export type AddressFiltersSchema = typeof addressFiltersSchema.static;

const addressSchema = spread(address, 'select');

const addressResponseItemSchema = t.Object({
    id: addressSchema.id,
    name: addressSchema.name,
    description: addressSchema.description,
    kind: addressSchema.kind,
    formatted: addressSchema.formatted,
    path: addressSchema.path,
    coordinates: t.Nullable(
        t.Object({
            latitude: t.Number(),
            longitude: t.Number(),
        }),
    ),
    location: addressSchema.location,
    slug: addressSchema.slug,
    url: addressSchema.url,
    urlRoot: addressSchema.urlRoot,
    raw: addressSchema.raw,
});

export const responseSchema = createPaginatedResponseSchema(
    addressResponseItemSchema,
);
