import { Router, type Request, type Response } from "express"
import { prisma } from "../../lib/prisma"

const router = Router()

// Get all parking spots
router.get("/", async (req: Request, res: Response) => {
  try {
    const spots = await prisma.parkingSpot.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        visits: true,
      },
    })
    res.json(spots)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch parking spots" })
  }
})

// Get available spots
router.get("/available", async (req: Request, res: Response) => {
  try {
    const available = await prisma.parkingSpot.findMany({
      where: { isBusy: false },
      include: { visits: true },
    })
    res.json(available)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available spots" })
  }
})

// Get single parking spot
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const spot = await prisma.parkingSpot.findUnique({
      where: { id: Number.parseInt(req.params.id) },
      include: { user: true, visits: true },
    })
    if (!spot) {
      return res.status(404).json({ error: "Parking spot not found" })
    }
    res.json(spot)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch parking spot" })
  }
})

// Create parking spot
router.post("/", async (req: Request, res: Response) => {
  try {
    const { spotCode } = req.body

    if (!spotCode) {
      return res.status(400).json({ error: "spotCode is required" })
    }

    const spot = await prisma.parkingSpot.create({
      data: { spotCode, isBusy: false },
    })
    res.status(201).json(spot)
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Spot code already exists" })
    }
    res.status(400).json({ error: "Failed to create parking spot" })
  }
})

// Book parking spot
router.patch("/:id/book", async (req: Request, res: Response) => {
  try {
    const { userId } = req.body
    const spot = await prisma.parkingSpot.update({
      where: { id: Number.parseInt(req.params.id) },
      data: { isBusy: true, userId },
    })
    res.json(spot)
  } catch (error) {
    res.status(400).json({ error: "Failed to book parking spot" })
  }
})

// Release parking spot
router.patch("/:id/release", async (req: Request, res: Response) => {
  try {
    const spot = await prisma.parkingSpot.update({
      where: { id: Number.parseInt(req.params.id) },
      data: { isBusy: false, userId: null },
    })
    res.json(spot)
  } catch (error) {
    res.status(400).json({ error: "Failed to release parking spot" })
  }
})

export default router
