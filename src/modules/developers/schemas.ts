import { t } from 'elysia';
import { spread } from '../../db/helpers';
import { developer } from '../../db/schema/developer';
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

export const developerFiltersSchema = t.Object({
    id: t.Optional(t.Number()),
    id__in: t.Optional(t.Array(t.Number())),
});

export type DeveloperFiltersSchema = typeof developerFiltersSchema.static;

const developerSchema = spread(developer, 'select');

const developerResponseItemSchema = t.Object({
    id: developerSchema.id,
    name: developerSchema.name,
    logo: developerSchema.logo,
    slug: developerSchema.slug,
});

export const responseSchema = t.Union([
    createPaginatedResponseSchema(developerResponseItemSchema),
    t.Array(developerResponseItemSchema),
]);
