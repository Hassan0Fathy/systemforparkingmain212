import { prisma } from "../lib/prisma"
import bcrypt from "bcryptjs"

async function testDatabase() {
  try {
    console.log("[v0] Testing database connection...")

    // Test 1: Create a test user
    console.log("[v0] Creating test user...")
    const testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
        password: await bcrypt.hash("password123", 10),
      },
    })
    console.log("[v0] ✓ User created:", {
      id: testUser.id,
      name: testUser.name,
      email: testUser.email,
    })

    // Test 2: Create test parking spots
    console.log("[v0] Creating test parking spots...")
    const spot1 = await prisma.parkingSpot.create({
      data: { spotCode: "A-001", isBusy: false },
    })
    const spot2 = await prisma.parkingSpot.create({
      data: { spotCode: "A-002", isBusy: true, userId: testUser.id },
    })
    console.log("[v0] ✓ Parking spots created:", { spot1: spot1.spotCode, spot2: spot2.spotCode })

    // Test 3: Create a parking visit
    console.log("[v0] Creating parking visit...")
    const visit = await prisma.parkingVisit.create({
      data: {
        spotId: spot1.id,
        checkIn: new Date(),
      },
    })
    console.log("[v0] ✓ Visit created:", { visitId: visit.id, spotId: visit.spotId })

    // Test 4: Query database statistics
    console.log("[v0] Fetching database statistics...")
    const userCount = await prisma.user.count()
    const spotCount = await prisma.parkingSpot.count()
    const visitCount = await prisma.parkingVisit.count()

    console.log("[v0] Database Summary:")
    console.log(`  - Users: ${userCount}`)
    console.log(`  - Parking Spots: ${spotCount}`)
    console.log(`  - Visits: ${visitCount}`)

    // Test 5: Query with relations
    console.log("[v0] Testing relations...")
    const userWithSpots = await prisma.user.findUnique({
      where: { id: testUser.id },
      include: { parkingSpots: true },
    })
    console.log("[v0] ✓ User with parking spots:", {
      userId: userWithSpots?.id,
      spots: userWithSpots?.parkingSpots.length,
    })

    console.log("[v0] ✓ All database tests passed!")
    console.log("[v0] Database is ready for deployment!")
  } catch (error) {
    console.error("[v0] Database test failed:", error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()
