import {
    boolean,
    foreignKey,
    integer,
    pgTable,
    varchar,
} from 'drizzle-orm/pg-core';
import { contact } from '../contact';
import { employee } from '../employee';
import { phoneBaseFields } from './base';

export const virtualPhone = pgTable(
    'employee_phonevirtual',
    {
        ...phoneBaseFields,
        contactId: integer('contact_id')
            .references(() => contact.id, { onDelete: 'restrict' })
            .notNull(),
        employeeId: integer('employee_id')
            .references(() => employee.id, { onDelete: 'restrict' })
            .notNull(),
        phoneType: varchar('phone_type', { length: 50 }),
        acceptIncomingCalls: boolean('accept_incoming_calls').default(true),
    },
    (table) => [
        foreignKey({
            columns: [table.contactId],
            foreignColumns: [contact.id],
        }),
        foreignKey({
            columns: [table.employeeId],
            foreignColumns: [employee.id],
        }),
    ],
);
