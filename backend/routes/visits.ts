import { Router, type Request, type Response } from "express"
import { prisma } from "../../lib/prisma"

const router = Router()

// Get all visits
router.get("/", async (req: Request, res: Response) => {
  try {
    const visits = await prisma.parkingVisit.findMany({
      include: { spot: true },
      orderBy: { checkIn: "desc" },
    })
    res.json(visits)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visits" })
  }
})

// Get visits for a spot
router.get("/spot/:spotId", async (req: Request, res: Response) => {
  try {
    const visits = await prisma.parkingVisit.findMany({
      where: { spotId: Number.parseInt(req.params.spotId) },
      orderBy: { checkIn: "desc" },
    })
    res.json(visits)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch visits" })
  }
})

// Check in
router.post("/check-in", async (req: Request, res: Response) => {
  try {
    const { spotId } = req.body

    if (!spotId) {
      return res.status(400).json({ error: "spotId is required" })
    }

    const visit = await prisma.parkingVisit.create({
      data: { spotId, checkIn: new Date() },
    })
    res.status(201).json(visit)
  } catch (error) {
    res.status(400).json({ error: "Failed to check in" })
  }
})

// Check out
router.patch("/:id/check-out", async (req: Request, res: Response) => {
  try {
    const visit = await prisma.parkingVisit.update({
      where: { id: Number.parseInt(req.params.id) },
      data: { checkOut: new Date() },
    })
    res.json(visit)
  } catch (error) {
    res.status(400).json({ error: "Failed to check out" })
  }
})

export default router
