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
import { translate } from '../helpers';

const regularColumns = {
    id: serial('id').primaryKey(),
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
    stats: jsonb('stats').default({}),
    prices: jsonb('prices').default({}),
    sizes: jsonb('sizes').default({}),
    parentId: integer('parent_id'),
    raw: jsonb('raw').default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date()),
};

const { columns: translatedColumns, fields: translatedFields } = translate({
    name: ({ column }) => varchar(column, { length: 100 }).notNull(),
    description: ({ column }) => varchar(column, { length: 255 }).default(''),
    formatted: ({ column }) => varchar(column, { length: 255 }).default(''),
    location: ({ column }) => jsonb(column).default([]),
    slug: ({ column }) => varchar(column, { length: 100 }).default(''),
    url: ({ column }) => varchar(column, { length: 1000 }).default(''),
    urlRoot: ({ column }) => jsonb(column).default([]),
});

export const address = pgTable(
    'address',
    {
        ...regularColumns,
        ...translatedColumns,
    },
    (table) => [
        foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
            name: 'parent',
        }),
    ],
);

export type TranslatedField = (typeof translatedFields)[number];

export { translatedFields };
