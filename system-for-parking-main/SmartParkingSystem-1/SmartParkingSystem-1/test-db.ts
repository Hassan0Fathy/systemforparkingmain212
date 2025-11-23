import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { sql } from 'drizzle-orm';
import { users, cars, visits } from './shared/schema';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL must be set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    const requiredTables = ['users', 'cars', 'visits'];
    const existing = await db.execute(sql`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
        AND table_name = ANY(${sql.array(requiredTables, 'text')})
    `);

    const existingSet = new Set<string>((existing as any).rows.map((r: any) => r.table_name));
    const missing = requiredTables.filter(t => !existingSet.has(t));
    if (missing.length) {
      console.error('Missing tables:', missing.join(', '));
      process.exit(1);
    }

    const inserted = await db.insert(users).values({ username: 'test', password: '1234' }).returning();
    console.log('Inserted user:', inserted[0]);

    const fetchedUsers = await db.execute(sql`SELECT id, username, role, created_at FROM users ORDER BY created_at DESC LIMIT 5`);
    console.log('Recent users:', (fetchedUsers as any).rows);

  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
