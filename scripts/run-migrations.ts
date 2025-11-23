import { readFileSync } from "fs"
import { resolve } from "path"
import pg from "pg"

const { Client } = pg

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    console.log("[v0] Connecting to database...")
    await client.connect()
    console.log("[v0] Connected to database")

    // Read the SQL file
    const sqlPath = resolve(__dirname, "../db/database.sql")
    const sql = readFileSync(sqlPath, "utf-8")
    console.log("[v0] Running migrations...")

    // Execute the SQL
    await client.query(sql)
    console.log("[v0] Migrations completed successfully")
  } catch (error) {
    console.error("[v0] Migration error:", error)
    process.exit(1)
  } finally {
    await client.end()
  }
}

// Run migrations
runMigrations().catch(console.error)
