import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { account } from './schema/account';
import { address } from './schema/address';
import { developer } from './schema/developer';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});

export const db = drizzle({
    client: pool,
    schema: { account, address, developer },
});
