import express, { type Express, type Request, type Response } from "express"
import { prisma } from "../lib/prisma"
import { Router } from "express"

const app: Express = express()
const PORT = process.env.PORT || 3000
const router = Router()

// Middleware
app.use(express.json())

// ========== User Routes ==========
router.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        parkingSpots: true,
      },
    })
    res.json(users)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

router.post("/users", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password, // In production, hash the password
      },
    })
    res.status(201).json(user)
  } catch (error) {
    res.status(400).json({ error: "Failed to create user" })
  }
})

// ========== Parking Spot Routes ==========
app.get("/parking", async (req: Request, res: Response) => {
  try {
    const spots = await prisma.parkingSpot.findMany({
      include: {
        user: true,
        visits: true,
      },
    })
    res.json(spots)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch parking spots" })
  }
})

app.post("/parking", async (req: Request, res: Response) => {
  try {
    const { spotCode, userId } = req.body
    const spot = await prisma.parkingSpot.create({
      data: {
        spotCode,
        userId: userId || null,
      },
    })
    res.status(201).json(spot)
  } catch (error) {
    res.status(400).json({ error: "Failed to create parking spot" })
  }
})

app.patch("/parking/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { isBusy, userId } = req.body
    const spot = await prisma.parkingSpot.update({
      where: { id: Number.parseInt(id) },
      data: {
        isBusy: isBusy !== undefined ? isBusy : undefined,
        userId: userId !== undefined ? userId : undefined,
      },
    })
    res.json(spot)
  } catch (error) {
    res.status(400).json({ error: "Failed to update parking spot" })
  }
})

// ========== Parking Visit Routes ==========
app.post("/visits", async (req: Request, res: Response) => {
  try {
    const { spotId } = req.body
    const visit = await prisma.parkingVisit.create({
      data: {
        spotId,
        checkIn: new Date(),
      },
    })
    res.status(201).json(visit)
  } catch (error) {
    res.status(400).json({ error: "Failed to create parking visit" })
  }
})

app.patch("/visits/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const visit = await prisma.parkingVisit.update({
      where: { id: Number.parseInt(id) },
      data: {
        checkOut: new Date(),
      },
    })
    res.json(visit)
  } catch (error) {
    res.status(400).json({ error: "Failed to update parking visit" })
  }
})

// ========== Health Check ==========
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok" })
})

// Use the router
app.use(router)

// Start Server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
  console.log(`✓ Database connected to ${process.env.DATABASE_URL?.split("@")[1]}`)
})

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("\n✓ Shutting down gracefully...")
  await prisma.$disconnect()
  process.exit(0)
})
