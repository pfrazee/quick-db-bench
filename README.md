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
DB_NAME=myapp
```

4. Create the database:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS myapp;"
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

### Migration Structure

Each migration file exports two functions:
- `up(db)` - Applies the migration
- `down(db)` - Reverts the migration

Example migration:
```javascript
import { Kysely, sql } from 'kysely';

export async function up(db) {
  await db.schema
    .createTable('posts')
    .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('content', 'text')
    .execute();
}

export async function down(db) {
  await db.schema.dropTable('posts').execute();
}
```

## API Endpoints

### Health Check
- **GET** `/health` - Check if the server is running

### Users
- **GET** `/users` - Get all users
- **GET** `/users/:id` - Get a specific user by ID
- **POST** `/users` - Create a new user
  - Body: `{ "name": "John Doe", "email": "john@example.com" }`

## Example Usage

Get all users:
```bash
curl http://localhost:3000/users
```

Create a new user:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name":"Alice Brown","email":"alice@example.com"}'
```

Get a specific user:
```bash
curl http://localhost:3000/users/1
```

## Project Structure

```
.
├── src/
│   ├── migrations/             # Database migrations
│   │   └── 001_setup_db.js
│   ├── scripts/                # CLI scripts
│   │   ├── migrate.js          # Migration runner
│   │   └── create-migration.js # Migration generator
│   ├── index.js                # Express server and routes
│   ├── database.js             # Kysely database configuration
│   └── migrator.js             # Migration configuration
├── schema.sql                  # Legacy schema (use migrations instead)
├── package.json                # Project dependencies
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Technology Stack

- **Express.js** - Web framework
- **Kysely** - Type-safe SQL query builder
- **mysql2** - MySQL client for Node.js
- **dotenv** - Environment variable management
