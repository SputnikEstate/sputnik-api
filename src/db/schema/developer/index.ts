import {
    jsonb,
    pgTable,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';

export const developer = pgTable('developer', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 255 }).notNull(),
    website: varchar('website', { length: 1000 }),
    logo: varchar('logo', { length: 255 }),
    logoExternalUrl: varchar('logo_external_url', { length: 1000 }),
    cianId: varchar('cian_id', { length: 50 }),
    cianRaw: jsonb('cian_raw').default({}),
    propertyfinderRaw: jsonb('propertyfinder_raw').default({}),
    slug: varchar('slug', { length: 255 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .$onUpdate(() => new Date()),
});
