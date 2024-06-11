import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from '@prisma/extension-accelerate'
import { Hono } from 'hono'
import { env } from 'hono/adapter'
import * as dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

const app = new Hono()

// Correctly access the environment variable
const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
    throw new Error('DATABASE_URL environment variable is not set')
}

const prisma = new PrismaClient({
    datasourceUrl: databaseUrl,
}).$extends(withAccelerate())

// Your additional code here, e.g., routes

export default app
