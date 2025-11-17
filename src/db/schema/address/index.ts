import {
    boolean,
    foreignKey,
    geometry,
    integer,
    jsonb,
    pgTable,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';
import { createSchemaFactory } from 'drizzle-typebox';
import { t } from 'elysia';

export const address = pgTable(
    'address',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 100 }).notNull(),
        description: varchar('description', { length: 255 }).default(''),
        formatted: varchar('formatted', { length: 255 }).default(''),
        kind: varchar('kind', { length: 100 }).notNull(),
        precision: varchar('precision', { length: 100 }).default(''),
        point: geometry('point', { type: 'point', mode: 'xy', srid: 4326 }),
        cianId: integer('cian_id'),
        cianGeocodeData: jsonb('cian_geocode_data').default({}),
        autoUpdate: boolean('auto_update'),
        needCheck: boolean('need_check').default(false),
        provider: varchar('provider', { length: 50 }).default('yandex'),
        externalId: varchar('external_id', { length: 50 }).default(''),
        path: integer('path').array().default([]),
        location: jsonb('location').default([]),
        slug: varchar('slug', { length: 100 }).default(''),
        url: varchar('url', { length: 1000 }).default(''),
        urlRoot: jsonb('url_root').default([]),
        stats: jsonb('stats').default({}),
        prices: jsonb('prices').default({}),
        sizes: jsonb('sizes').default({}),
        parentId: integer('parent_id'),
        raw: jsonb('raw').default({}),
        createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .defaultNow()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
            name: 'parent',
        }),
    ],
);

const { createSelectSchema } = createSchemaFactory({ typeboxInstance: t });

export const addressSelect = createSelectSchema(address);
export type AddressSelect = typeof addressSelect.static;
