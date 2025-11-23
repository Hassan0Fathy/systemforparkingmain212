import { Router, type Request, type Response } from "express"
import { prisma } from "../../lib/prisma"
import bcrypt from "bcryptjs"

const router = Router()

// Get all users
router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        parkingSpots: true,
      },
    })
    res.json(users)
  } catch (error) {
    console.error("[v0] Users fetch error:", error)
    res.status(500).json({ error: "Failed to fetch users" })
  }
})

// Get single user
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: Number.parseInt(req.params.id) },
      include: { parkingSpots: true },
    })
    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user" })
  }
})

// Create user
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    })
  } catch (error: any) {
    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email already exists" })
    }
    res.status(400).json({ error: "Failed to create user" })
  }
})

// Update user
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body
    const user = await prisma.user.update({
      where: { id: Number.parseInt(req.params.id) },
      data: {
        ...(name && { name }),
        ...(email && { email }),
      },
    })
    res.json(user)
  } catch (error) {
    res.status(400).json({ error: "Failed to update user" })
  }
})

// Delete user
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.user.delete({
      where: { id: Number.parseInt(req.params.id) },
    })
    res.json({ message: "User deleted successfully" })
  } catch (error) {
    res.status(400).json({ error: "Failed to delete user" })
  }
})

export default router
