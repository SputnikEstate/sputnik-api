import {
    boolean,
    integer,
    jsonb,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';

export const phoneFields = {
    id: serial('id').primaryKey(),
    phone: varchar('phone', { length: 50 }).notNull(),
    phoneNational: varchar('phone_national', { length: 50 }),
    phoneInternational: varchar('phone_international', {
        length: 50,
    }),
    provider: varchar('provider', { length: 100 }),
    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
};

export const phoneBaseFields = {
    ...phoneFields,
    isPossibleNumber: boolean('is_possible_number'),
    isValidNumber: boolean('is_valid_number'),
    numberType: varchar('number_type', { length: 50 }),
    numberTypeLocal: varchar('number_type_local', {
        length: 50,
    }),
    countryCode: varchar('country_code', { length: 5 }),
    cityCode: varchar('city_code', { length: 5 }),
    number: varchar('number', { length: 15 }),
    extension: varchar('extension', { length: 15 }),
    country: varchar('country', { length: 100 }),
    region: varchar('region', { length: 100 }),
    timezone: varchar('timezone', { length: 50 }),
    qc: integer('qc'),
    waId: varchar('wa_id', { length: 50 }),
    waStatus: integer('wa_status'),
    waIsBusiness: boolean('wa_is_business'),
    waCanReceiveMessage: boolean('wa_can_receive_message'),
    waNumberExists: boolean('wa_number_exists'),
    waLastCheck: timestamp('wa_last_check', { withTimezone: true }),
    waCheckRaw: jsonb('wa_check_raw').default({}),
    waAvatarUrl: varchar('wa_avatar_url', { length: 500 }),
    waAvatar: varchar('wa_avatar', { length: 1000 }),
    waAvatarLastCheck: timestamp('wa_avatar_last_check', {
        withTimezone: true,
    }),
};
