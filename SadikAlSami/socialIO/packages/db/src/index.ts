import { env } from '@socialIO/env/server';
import { drizzle, type NodePgQueryResultHKT } from 'drizzle-orm/node-postgres';

import * as schema from './schema';
import type { PgTransaction } from 'drizzle-orm/pg-core';
import type { ExtractTablesWithRelations } from 'drizzle-orm';

export function createDb() {
	return drizzle(env.DATABASE_URL, { schema });
}

export const db = createDb();
export type DB = typeof db;
export type Transaction = PgTransaction<NodePgQueryResultHKT, typeof schema, ExtractTablesWithRelations<typeof schema>>;
export type TX = DB | Transaction;
