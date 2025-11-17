import { drizzle } from 'drizzle-orm/node-postgres';
import { address } from './schema/address';

export const db = drizzle(process.env.DATABASE_URL!, {
    schema: { address },
});
