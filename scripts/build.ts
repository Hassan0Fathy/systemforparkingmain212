import { execSync } from "child_process"

const log = (msg: string) => console.log(`[v0] ${msg}`)
const error = (msg: string) => console.error(`[v0] ERROR: ${msg}`)

async function build() {
  try {
    log("Starting Vercel build process...")

    // Step 1: Generate Prisma Client
    log("Generating Prisma Client...")
    try {
      execSync("prisma generate", { stdio: "inherit" })
      log("✓ Prisma Client generated")
    } catch (e) {
      error("Failed to generate Prisma Client")
      throw e
    }

    // Step 2: Run database migrations
    log("Running database migrations...")
    try {
      execSync("tsx scripts/run-migrations.ts", { stdio: "inherit" })
      log("✓ Database migrations completed")
    } catch (e) {
      error("Failed to run migrations")
      throw e
    }

    // Step 3: Next.js build
    log("Building Next.js application...")
    try {
      execSync("next build", { stdio: "inherit" })
      log("✓ Next.js build completed")
    } catch (e) {
      error("Failed to build Next.js")
      throw e
    }

    log("Build successful! Ready for deployment.")
  } catch (err) {
    error("Build process failed")
    process.exit(1)
  }
}

build()
