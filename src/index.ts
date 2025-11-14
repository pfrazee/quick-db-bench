import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { db } from './database.js'
import * as indexer from './indexer'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const NEXUS_PORT = process.env.NEXUS_PORT || 8080

app.use(express.json())

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Profiles endpoints
app.get('/profiles', async (req: Request, res: Response) => {
  try {
    const profiles = await db.selectFrom('profiles').selectAll().execute()
    res.json(profiles)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})

app.get('/profiles/:handle', async (req: Request, res: Response) => {
  try {
    const profile = await db
      .selectFrom('profiles')
      .selectAll()
      .where('handle', '=', decodeURIComponent(req.params.handle))
      .executeTakeFirst()

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' })
      return
    }

    res.json(profile)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})

// Posts endpoints
app.get('/posts', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    const posts = await db
      .selectFrom('posts')
      .selectAll()
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .execute()

    res.json(posts)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})

app.get('/posts/:handle', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    const profile = await db
      .selectFrom('profiles')
      .selectAll()
      .where('handle', '=', decodeURIComponent(req.params.handle))
      .executeTakeFirst()

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' })
      return
    }

    const posts = await db
      .selectFrom('posts')
      .selectAll()
      .orderBy('createdAt', 'desc')
      .where('_repo', '=', profile._repo)
      .limit(limit)
      .offset(offset)
      .execute()

    res.json(posts)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})

// Follows endpoints
app.get('/follows/:handle', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    const profile = await db
      .selectFrom('profiles')
      .selectAll()
      .where('handle', '=', decodeURIComponent(req.params.handle))
      .executeTakeFirst()

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' })
      return
    }

    const follows = await db
      .selectFrom('follows')
      .selectAll()
      .orderBy('createdAt', 'desc')
      .where('_repo', '=', profile._repo)
      .limit(limit)
      .offset(offset)
      .execute()

    res.json(follows)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})

app.get('/followers/:handle', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50
    const offset = parseInt(req.query.offset as string) || 0

    const profile = await db
      .selectFrom('profiles')
      .selectAll()
      .where('handle', '=', decodeURIComponent(req.params.handle))
      .executeTakeFirst()

    if (!profile) {
      res.status(404).json({ error: 'Profile not found' })
      return
    }

    const followers = await db
      .selectFrom('follows')
      .selectAll()
      .orderBy('createdAt', 'desc')
      .where('subject', '=', profile._repo)
      .limit(limit)
      .offset(offset)
      .execute()

    res.json(followers)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    res.status(500).json({ error: message })
  }
})

const server = app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`)
  await indexer.start(`http://localhost:${NEXUS_PORT}`)
  console.log(`Connected to nexus at http://localhost:${NEXUS_PORT}`)
})

// Graceful shutdown handler
async function shutdown(signal: string) {
  console.log(`\n${signal} received. Starting graceful shutdown...`)

  // Stop accepting new requests
  server.close(() => {
    console.log('HTTP server closed')
  })

  try {
    // Stop the indexer
    console.log('Stopping indexer...')
    await indexer.destroy()
    console.log('Indexer stopped')

    // Close database connection
    console.log('Closing database connection...')
    await db.destroy()
    console.log('Database connection closed')

    console.log('Graceful shutdown complete')
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
}

// Listen for termination signals
process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
