import express, { type Express, type Request, type Response } from "express"
import { prisma } from "../lib/prisma"
import usersRouter from "./routes/users"
import parkingRouter from "./routes/parking"
import visitsRouter from "./routes/visits"

const app: Express = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")
  next()
})

// Routes
app.use("/api/users", usersRouter)
app.use("/api/parking", parkingRouter)
app.use("/api/visits", visitsRouter)

// Health check
app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date() })
})

// Start Server
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`)
})

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("\n✓ Shutting down gracefully...")
  await prisma.$disconnect()
  process.exit(0)
})

export default app
