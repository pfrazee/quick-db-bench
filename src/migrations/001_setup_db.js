import { Kysely, sql } from 'kysely'

/**
 * @param {Kysely<any>} db
 */
export async function up(db) {
  await db.schema
    .createTable('profiles')
    .call(addCommonFields)
    .addColumn('handle', 'varchar(255)', (col) => col.notNull())
    .addColumn('displayName', 'varchar(255)')
    .addColumn('description', 'text')
    .addColumn('createdAt', 'timestamp')
    .execute()

  await db.schema
    .createIndex('profiles_repo_index')
    .on('profiles')
    .column('_repo')
    .execute()

  await db.schema
    .createIndex('profiles_handle_index')
    .on('profiles')
    .column('handle')
    .execute()

  await db.schema
    .createTable('follows')
    .call(addCommonFields)
    .addColumn('subject', 'varchar(255)', (col) =>
      col.references('profiles._repo').onDelete('no action').notNull()
    )
    .addColumn('createdAt', 'timestamp')
    .execute()

  await db.schema
    .createTable('likes')
    .call(addCommonFields)
    .addColumn('subject', 'varchar(255)', (col) =>
      col.references('posts._uri').onDelete('no action').notNull()
    )
    .addColumn('createdAt', 'timestamp')
    .execute()

  await db.schema
    .createTable('reposts')
    .call(addCommonFields)
    .addColumn('subject', 'varchar(255)', (col) =>
      col.references('posts._uri').onDelete('no action').notNull()
    )
    .addColumn('createdAt', 'timestamp')
    .execute()

  await db.schema
    .createTable('posts')
    .call(addCommonFields)
    .addColumn('text', 'text')
    .addColumn('replyTo', 'varchar(255)')
    .addColumn('createdAt', 'timestamp')
    .execute()

  await db.schema
    .createIndex('posts_repo_index')
    .on('posts')
    .column('_repo')
    .execute()

  await db.schema
    .createTable('threadgates')
    .call(addCommonFields)
    .addColumn('rules', 'json')
    .addColumn('createdAt', 'timestamp')
    .execute()
}

/**
 * @param {Kysely<any>} db
 */
export async function down(db) {
  await db.schema
    .dropTable('threadgates')
    .dropTable('posts')
    .dropTable('reposts')
    .dropTable('likes')
    .dropTable('follows')
    .dropTable('profiles')
    .execute()
}

function addCommonFields() {
  return this.addColumn('_uri', 'varchar(255)', (col) =>
    col.notNull().primaryKey()
  )
    .addColumn('_repo', 'varchar(255)', (col) => col.notNull())
    .addColumn('_rkey', 'varchar(255)', (col) => col.notNull())
    .addColumn('_indexedAt', 'timestamp', (col) =>
      col
        .defaultTo(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`)
        .notNull()
    )
}
