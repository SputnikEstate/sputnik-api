import {
    boolean,
    integer,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';

export const emailBaseFields = {
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
    createdAt: timestamp('created_at', { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
};
