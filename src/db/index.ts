import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { account } from './schema/account';
import { address } from './schema/address';
import {
    contact,
    contactEmail,
    contactPhone,
    contactTelegram,
} from './schema/contact';
import { developer } from './schema/developer';
import {
    department,
    employee,
    employeeEmail,
    employeePhone,
    role,
} from './schema/employee';
import { virtualPhone } from './schema/phones';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({
    client: pool,
    schema: {
        account,
        address,
        contact,
        contactEmail,
        contactPhone,
        contactTelegram,
        developer,
        employee,
        employeePhone,
        employeeEmail,
        department,
        role,
        virtualPhone,
    },
});
