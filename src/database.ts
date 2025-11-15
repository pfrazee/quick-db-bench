import { Kysely, MysqlDialect, MysqlPool } from 'kysely'
import { createPool } from 'mysql2'
import { Database } from './types/database.js'

export let db: Kysely<Database> | null = null

export function start() {
  const dialect = new MysqlDialect({
    pool: createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'myapp',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    }) as MysqlPool,
  })

  db = new Kysely<Database>({
    dialect,
  })
}

export function inst(): Kysely<Database> {
  if (!db) {
    throw new Error('Database not yet initialized')
  }
  return db
}

export async function destroy() {
  await db?.destroy()
}
