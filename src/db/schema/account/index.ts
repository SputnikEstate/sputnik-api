import {
    boolean,
    integer,
    pgTable,
    serial,
    timestamp,
    varchar,
} from 'drizzle-orm/pg-core';

export const account = pgTable('account', {
    id: serial('id').primaryKey(),
    password: varchar('password', { length: 128 }),
    lastLogin: timestamp('last_login', { withTimezone: true }),
    isSuperuser: boolean('is_superuser').default(false).notNull(),
    isStaff: boolean('is_staff').default(false).notNull(),
    isActive: boolean('is_active').default(true).notNull(),
    isDeleted: boolean('is_deleted').default(false).notNull(),
    email: varchar('email', { length: 255 }).default(''),
    phone: varchar('phone', { length: 50 }).notNull().unique(),
    username: varchar('username', { length: 150 }).notNull().unique(),
    voximplantApplicationId: integer('voximplant_application_id'),
    voximplantUserActive: boolean('voximplant_user_active'),
    voximplantUserDisplayName: varchar('voximplant_user_display_name', { length: 256 }),
    voximplantUserId: integer('voximplant_user_id'),
    voximplantUserName: varchar('voximplant_user_name', { length: 49 }),
    voximplantUserPassword: varchar('voximplant_user_password', { length: 128 }),
    lastSeenAt: timestamp('last_seen_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
        .defaultNow()
        .notNull()
        .$onUpdate(() => new Date()),
});
