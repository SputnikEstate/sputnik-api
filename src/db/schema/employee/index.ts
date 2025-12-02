import {
    boolean,
    foreignKey,
    integer,
    pgTable,
    serial,
    varchar,
} from 'drizzle-orm/pg-core';
import { account } from '../account';
import { contactBaseFields } from '../contact/base';
import { emailBaseFields } from '../emails/base';
import { phoneBaseFields } from '../phones/base';

export const department = pgTable(
    'department',
    {
        id: serial('id').primaryKey(),
        name: varchar('name', { length: 100 }),
        type: varchar('type', { length: 10 }),
        parentId: integer('parent_id'),
        externalId: integer('external_id'),
    },
    (table) => [
        foreignKey({
            columns: [table.parentId],
            foreignColumns: [table.id],
            name: 'parent',
        }),
    ],
);

export const role = pgTable('role', {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 50 }),
    externalId: integer('external_id'),
});

export const employee = pgTable(
    'employee',
    {
        ...contactBaseFields,
        accountId: integer('account_id')
            .references(() => account.id, { onDelete: 'restrict' })
            .unique(),
        state: varchar('state', { length: 5 }),
        type: varchar('type', { length: 8 }),
        canUseCrm: boolean('can_use_crm').default(false),
        headline: varchar('headline', { length: 255 }),
        caption: varchar('caption', { length: 255 }),
        avatar: varchar('avatar', { length: 1000 }),
        avatarRounded: varchar('avatar_rounded', { length: 1000 }),
        departmentId: integer('department_id').references(() => department.id, {
            onDelete: 'restrict',
        }),
        roleId: integer('role_id').references(() => role.id, {
            onDelete: 'restrict',
        }),
    },
    (table) => [
        foreignKey({
            columns: [table.accountId],
            foreignColumns: [account.id],
        }),
        foreignKey({
            columns: [table.departmentId],
            foreignColumns: [department.id],
        }),
        foreignKey({
            columns: [table.roleId],
            foreignColumns: [role.id],
        }),
    ],
);

export const employeePhone = pgTable(
    'employee_phone',
    {
        ...phoneBaseFields,
        phoneType: varchar('phone_type', { length: 7 }),
        employeeId: integer('employee_id')
            .references(() => employee.id, { onDelete: 'restrict' })
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.employeeId],
            foreignColumns: [employee.id],
        }),
    ],
);

export const employeeEmail = pgTable(
    'employee_email',
    {
        ...emailBaseFields,
        emailType: varchar('email_type', { length: 7 }),
        employeeId: integer('employee_id')
            .references(() => employee.id, { onDelete: 'restrict' })
            .notNull(),
    },
    (table) => [
        foreignKey({
            columns: [table.employeeId],
            foreignColumns: [employee.id],
        }),
    ],
);
