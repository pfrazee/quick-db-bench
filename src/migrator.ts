import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { Migrator, FileMigrationProvider } from 'kysely'
import * as db from './database.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function migrator() {
  return new Migrator({
    db: db.inst(),
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })
}

export async function migrateToLatest(): Promise<void> {
  const { error, results } = await migrator().migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migration "${it.migrationName}" was executed successfully`)
    } else if (it.status === 'Error') {
      console.error(`Failed to execute migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('Failed to migrate')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

export async function migrateDown(): Promise<void> {
  const { error, results } = await migrator().migrateDown()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`Migration "${it.migrationName}" was reverted successfully`)
    } else if (it.status === 'Error') {
      console.error(`Failed to revert migration "${it.migrationName}"`)
    }
  })

  if (error) {
    console.error('Failed to migrate down')
    console.error(error)
    process.exit(1)
  }

  await db.destroy()
}

export async function migrationStatus(): Promise<void> {
  const migrations = await migrator().getMigrations()

  console.log('\nMigration Status:\n')
  migrations.forEach((migration) => {
    const status = migration.executedAt
      ? `✓ Executed at ${migration.executedAt.toISOString()}`
      : '✗ Pending'
    console.log(`${migration.name}: ${status}`)
  })
  console.log()

  await db.destroy()
}
