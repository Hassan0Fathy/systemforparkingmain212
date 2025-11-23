import { defineConfig } from "@prisma/internals"

export const config = defineConfig({
  datasource: {
    provider: "postgresql",
    datasourceUrl: process.env.DATABASE_URL,
  },
})
