import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { users, cars, visits } from './RoleSelector (2)/RoleSelector/shared/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testDatabase() {
  // 1. Connect to PostgreSQL
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set in .env file');
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const db = drizzle(pool);

  try {
    await pool.connect();
    console.log('✅ Successfully connected to the database');

    // 2. Check if tables exist
    console.log('\nChecking tables...');
    const tables = ['users', 'cars', 'visits'];
    
    for (const table of tables) {
      try {
        await db.execute(sql`SELECT 1 FROM ${sql.raw(table)} LIMIT 1`);
        console.log(`✅ Table '${table}' exists`);
      } catch (err) {
        console.error(`❌ Table '${table}' does not exist or is not accessible:`, err.message);
      }
    }

    // 3. Insert a test user
    console.log('\nInserting test user...');
    const testUser = {
      username: 'test',
      password: '1234',
      role: 'customer' as const,
    };

    const [insertedUser] = await db
      .insert(users)
      .values(testUser)
      .onConflictDoNothing()
      .returning();

    if (insertedUser) {
      console.log('✅ Inserted test user:', { id: insertedUser.id, username: insertedUser.username });
    } else {
      console.log('ℹ️ Test user already exists, skipping insertion');
    }

    // 4. Read the test user back
    console.log('\nFetching test user...');
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.username, 'test'));

    if (user) {
      console.log('✅ Found test user:', {
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
      });
    } else {
      console.error('❌ Test user not found after insertion');
    }

  } catch (error) {
    console.error('❌ Database test failed:', error);
    throw error;
  } finally {
    // 5. Close the connection
    await pool.end();
    console.log('\n✅ Database connection closed');
  }
}

// Run the test
testDatabase()
  .then(() => console.log('\n✅ Database test completed successfully!'))
  .catch((error) => {
    console.error('❌ Database test failed with error:', error);
    process.exit(1);
  });
