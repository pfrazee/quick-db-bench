# Express MySQL Application

A Node.js application using Express.js, MySQL, and Kysely for database operations.

## Prerequisites

- Node.js (v18 or higher)
- MySQL server

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file from the example:
```bash
cp .env.example .env
```

3. Update the `.env` file with your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=dbbench
```

4. Create the database:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS dbbench;"
```

5. Run migrations to create tables:
```bash
npm run migrate:up
```

## Running the Application

Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

## Database Migrations

This application uses Kysely's migration system to manage database schema changes.

### Migration Commands

Check migration status:
```bash
npm run migrate:status
```

Run all pending migrations:
```bash
npm run migrate:up
```

Rollback the last migration:
```bash
npm run migrate:down
```

Create a new migration:
```bash
npm run migrate:create <migration_name>
```

Example:
```bash
npm run migrate:create add_posts_table
```

This will create a new migration file in `src/migrations/` with a template that you can fill in.

# Paul's actual notes

Tab one:

```
npm run migrate:down
npm run migrate:up
```

Tab two:

```
rm ../nexus.db
sh scripts/start-nexus.sh
```

Tab three:

```
npm run build && npm start
```

Tab one:

```
sh scripts/backfill-test-1.sh
```