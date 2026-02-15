import { drizzle } from 'drizzle-orm/d1';
import * as schema from './schema';

export const getDrizzle = (db: D1Database) => {
  return drizzle(db, { schema });
};
