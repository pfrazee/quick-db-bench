import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import { db } from './database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

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

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
