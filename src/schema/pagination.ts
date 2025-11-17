import { type TSchema, t } from 'elysia';

export const paginationLinkSchema = t.Object({
    limit: t.Number(),
    offset: t.Number(),
});

export type PaginationLinkSchema = typeof paginationLinkSchema.static;

export const paginationQuerySchema = t.Object({
    limit: t.Optional(t.Number()),
    offset: t.Optional(t.Number()),
});

export type PaginationQuerySchema = typeof paginationQuerySchema.static;

export const createPaginatedResponseSchema = <T extends TSchema>(
    itemSchema: T,
) =>
    t.Object({
        next: t.Union([paginationLinkSchema, t.Null()]),
        previous: t.Union([paginationLinkSchema, t.Null()]),
        results: t.Array(itemSchema),
    });

export type PaginatedResponse<T> = {
    next: { limit: number; offset: number } | null;
    previous: { limit: number; offset: number } | null;
    results: T[];
};
