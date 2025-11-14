import dotenv from 'dotenv'
import { migrateToLatest, migrateDown, migrationStatus } from '../migrator.js'

dotenv.config()

const command = process.argv[2]

async function main(): Promise<void> {
  console.log('Running migrations...\n')

  switch (command) {
    case 'up':
    case 'latest':
      await migrateToLatest()
      console.log('Migration completed successfully!')
      break

    case 'down':
      await migrateDown()
      console.log('Rollback completed successfully!')
      break

    case 'status':
      await migrationStatus()
      break

    default:
      console.log('Usage: npm run migrate [up|down|status]')
      console.log('  up/latest - Run all pending migrations')
      console.log('  down      - Rollback the last migration')
      console.log('  status    - Show migration status')
      process.exit(1)
  }
}

main().catch((error) => {
  console.error('Migration failed:', error)
  process.exit(1)
})
