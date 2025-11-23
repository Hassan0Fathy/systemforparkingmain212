import 'dotenv/config';
import pg from 'pg';
import bcrypt from 'bcryptjs';

const { Client } = pg;
const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function seedAdmin() {
  try {
    await client.connect();
    console.log('Connected to database...');
    
    // Hash the password
    const hashedPassword = await bcrypt.hash('admin@123', 10);
    
    // Insert admin user
    const query = `
      INSERT INTO users (username, password, role)
      VALUES ($1, $2, $3)
      RETURNING id, username, role;
    `;
    
    const result = await client.query(query, ['admin123', hashedPassword, 'admin']);
    
    console.log('✅ Admin user created successfully!');
    console.log('Username: admin123');
    console.log('Password: admin@123');
    console.log('Role: admin');
    console.log('User ID:', result.rows[0]?.id);
    
    await client.end();
    process.exit(0);
  } catch (error: any) {
    if (error.code === '23505') {
      console.log('⚠️  Admin user already exists!');
      await client.end();
      process.exit(0);
    }
    console.error('❌ Error creating admin user:', error.message);
    await client.end();
    process.exit(1);
  }
}

seedAdmin();
