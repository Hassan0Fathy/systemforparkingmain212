import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users } from './shared/schema';

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL must be set');
    process.exit(1);
  }

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    const res = await db
      .insert(users)
      .values({ username: 'admin', password: 'admin123', role: 'admin', createdAt: new Date() })
      .onConflictDoNothing();

    console.log('Seed admin executed');
    if (Array.isArray(res) && res.length) {
      console.log('Inserted admin:', res[0]);
    }
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
