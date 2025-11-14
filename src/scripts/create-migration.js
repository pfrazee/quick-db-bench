import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const migrationsDir = path.join(__dirname, '../migrations');

const migrationName = process.argv[2];

if (!migrationName) {
  console.error('Usage: npm run migrate:create <migration_name>');
  console.error('Example: npm run migrate:create add_posts_table');
  process.exit(1);
}

const files = fs.readdirSync(migrationsDir);
const nextNumber = files.length + 1;
const paddedNumber = String(nextNumber).padStart(3, '0');
const fileName = `${paddedNumber}_${migrationName}.js`;
const filePath = path.join(migrationsDir, fileName);

const template = `import { Kysely, sql } from 'kysely';

/**
 * @param {Kysely<any>} db
 */
export async function up(db) {
  // Write your migration here
  // Example:
  // await db.schema
  //   .createTable('table_name')
  //   .addColumn('id', 'integer', (col) => col.autoIncrement().primaryKey())
  //   .addColumn('name', 'varchar(255)', (col) => col.notNull())
  //   .execute();
}

/**
 * @param {Kysely<any>} db
 */
export async function down(db) {
  // Write your rollback here
  // Example:
  // await db.schema.dropTable('table_name').execute();
}
`;

fs.writeFileSync(filePath, template);
console.log(`Created migration: ${fileName}`);
console.log(`Location: ${filePath}`);
