import {
    integer,
    jsonb,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';

export const contactBaseFields = {
    id: serial('id').primaryKey(),
    surname: varchar('surname', { length: 50 }),
    name: varchar('name', { length: 50 }),
    patronymic: varchar('patronymic', { length: 50 }),
    fullName: varchar('full_name', { length: 150 }),
    fullGenitive: varchar('full_genitive', { length: 150 }),
    fullDative: varchar('full_dative', { length: 150 }),
    fullAblative: varchar('full_ablative', { length: 150 }),
    gender: varchar('gender', { length: 10 }),
    countries: varchar('countries', { length: 100 }).array().default([]),
    details: jsonb('details').default({}),
    qc: integer('qc').default(-99),
    normalizeResult: jsonb('normalize_result').default({}),
    externalId: integer('external_id'),
    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
};
