import express from 'express'
import dotenv from 'dotenv'
import { db } from './database.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// Profiles endpoints
app.get('/profiles', async (req, res) => {
  try {
    const profiles = await db.selectFrom('profiles').selectAll().execute()
    res.json(profiles)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/profiles/:handle', async (req, res) => {
  try {
    const profile = await db
      .selectFrom('profiles')
      .selectAll()
      .where('handle', '=', decodeURIComponent(req.params.handle))
      .executeTakeFirst()

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
    }

    res.json(profile)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Posts endpoints
app.get('/posts', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const posts = await db
      .selectFrom('posts')
      .selectAll()
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .offset(offset)
      .execute()

    res.json(posts)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/posts/:handle', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const profile = await db
      .selectFrom('profiles')
      .selectAll()
      .where('handle', '=', decodeURIComponent(req.params.handle))
      .executeTakeFirst()

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
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
    res.status(500).json({ error: error.message })
  }
})

// Follows endpoints
app.get('/follows/:handle', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const profile = await db
      .selectFrom('profiles')
      .selectAll()
      .where('handle', '=', decodeURIComponent(req.params.handle))
      .executeTakeFirst()

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
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
    res.status(500).json({ error: error.message })
  }
})

app.get('/followers/:handle', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const profile = await db
      .selectFrom('profiles')
      .selectAll()
      .where('handle', '=', decodeURIComponent(req.params.handle))
      .executeTakeFirst()

    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' })
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
    res.status(500).json({ error: error.message })
  }
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
