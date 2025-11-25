import {
    boolean,
    foreignKey,
    integer,
    jsonb,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';
import { account } from '../account';

export const contact = pgTable(
    'contact',
    {
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
        accountId: integer('account_id')
            .references(() => account.id, { onDelete: 'restrict' })
            .unique(),
        note: text('note'),
        avatar: varchar('avatar', { length: 1000 }),
        avatarDhash: varchar('avatar_dhash', { length: 256 }),
        avatarManuallyAdded: boolean('avatar_manually_added'),
        avatarUpdatedAt: timestamp('avatar_updated_at', {
            withTimezone: true,
        }),
        lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        foreignKey({
            columns: [table.accountId],
            foreignColumns: [account.id],
        }),
    ],
);

export const contactPhone = pgTable(
    'contact_phone',
    {
        id: serial('id').primaryKey(),
        phone: varchar('phone', { length: 50 }).notNull(),
        phoneNational: varchar('phone_national', { length: 50 }),
        phoneInternational: varchar('phone_international', {
            length: 50,
        }),
        provider: varchar('provider', { length: 100 }),
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
        contactId: integer('contact_id')
            .references(() => contact.id, { onDelete: 'restrict' })
            .notNull(),
        primary: boolean('primary').default(false),
        verified: boolean('verified').default(false),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        foreignKey({
            columns: [table.contactId],
            foreignColumns: [contact.id],
        }),
    ],
);

export const contactEmail = pgTable(
    'contact_email',
    {
        id: serial('id').primaryKey(),
        email: varchar('email', { length: 255 }).notNull(),
        qc: integer('qc'),
        local: varchar('local', { length: 255 }),
        domain: varchar('domain', { length: 255 }),
        type: varchar('type', { length: 50 }),
        isReachable: varchar('is_reachable', { length: 50 }),
        isDisposable: boolean('is_disposable'),
        mxAcceptsMail: boolean('mx_accepts_mail'),
        canConnectSmtp: boolean('can_connect_smtp'),
        hasFullInbox: boolean('has_full_inbox'),
        isCatchAll: boolean('is_catch_all'),
        isDeliverable: boolean('is_deliverable'),
        isDisabled: boolean('is_disabled'),
        checkedAt: timestamp('checked_at', { withTimezone: true }),
        contactId: integer('contact_id')
            .references(() => contact.id, { onDelete: 'restrict' })
            .notNull(),
        primary: boolean('primary').default(false),
        verified: boolean('verified').default(false),
        failReported: boolean('fail_reported').default(false),
        lastFailReportId: integer('last_fail_report_id'),
        spamReported: boolean('spam_reported').default(false),
        lastSpamReportId: integer('last_spam_report_id'),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        foreignKey({
            columns: [table.contactId],
            foreignColumns: [contact.id],
        }),
    ],
);

export const contactTelegram = pgTable(
    'contact_telegram',
    {
        id: serial('id').primaryKey(),
        telegramId: varchar('telegram_id', { length: 100 }).unique().notNull(),
        username: varchar('username', { length: 100 }).unique(),
        firstName: varchar('first_name', { length: 255 }),
        lastName: varchar('last_name', { length: 255 }),
        phoneNumber: varchar('phone_number', { length: 50 }),
        langCode: varchar('lang_code', { length: 10 }),
        isBot: boolean('is_bot'),
        isPremium: boolean('is_premium'),
        contactId: integer('contact_id')
            .references(() => contact.id, { onDelete: 'restrict' })
            .notNull(),
        createdAt: timestamp('created_at', { withTimezone: true })
            .defaultNow()
            .notNull(),
        updatedAt: timestamp('updated_at', { withTimezone: true })
            .defaultNow()
            .notNull()
            .$onUpdate(() => new Date()),
    },
    (table) => [
        foreignKey({
            columns: [table.contactId],
            foreignColumns: [contact.id],
        }),
    ],
);
