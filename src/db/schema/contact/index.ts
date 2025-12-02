import {
    boolean,
    foreignKey,
    integer,
    pgTable,
    serial,
    text,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';
import { account } from '../account';
import { emailBaseFields } from '../emails/base';
import { phoneBaseFields } from '../phones/base';
import { contactBaseFields } from './base';

export const contact = pgTable(
    'contact',
    {
        ...contactBaseFields,
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
        ...phoneBaseFields,
        contactId: integer('contact_id')
            .references(() => contact.id, { onDelete: 'restrict' })
            .notNull(),
        primary: boolean('primary').default(false),
        verified: boolean('verified').default(false),
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
        ...emailBaseFields,
        contactId: integer('contact_id')
            .references(() => contact.id, { onDelete: 'restrict' })
            .notNull(),
        primary: boolean('primary').default(false),
        verified: boolean('verified').default(false),
        failReported: boolean('fail_reported').default(false),
        lastFailReportId: integer('last_fail_report_id'),
        spamReported: boolean('spam_reported').default(false),
        lastSpamReportId: integer('last_spam_report_id'),
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
