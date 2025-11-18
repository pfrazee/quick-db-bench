import { RecordEvent } from '../../vendor/nexus/src'
import { AppBskyGraphFollow } from '@atproto/api'
import * as db from '../../database.js'
import { Batcher } from '../batcher.js'
import { Database } from '../../types/database'
import { InsertObject } from 'kysely/dist/cjs/parser/insert-values-parser'
import { sql } from 'kysely'

const batcher = new Batcher<InsertObject<Database, 'follows'>>()

export async function onFollowRecord(evt: RecordEvent) {
  const _uri = `at://${evt.did}/${evt.collection}/${evt.rkey}`
  if (evt.action === 'create' || evt.action === 'update') {
    const res = AppBskyGraphFollow.validateRecord(evt.record)
    if (res.success) {
      const record = evt.record as AppBskyGraphFollow.Record
      const value = {
        _uri,
        _repo: evt.did,
        _rkey: evt.rkey,
        subject: record.subject,
        createdAt: new Date(record.createdAt),
      }
      await batcher.add(value, async (values) => {
        await db
          .inst()
          .insertInto('follows')
          .values(values)
          .onDuplicateKeyUpdate((_eb) => ({
            subject: sql.raw(`VALUES(subject)`),
            createdAt: sql.raw(`VALUES(createdAt)`),
          }))
          .execute()
      })
    } else {
      console.error('invalid follow record', _uri)
      console.error(evt)
      console.error(res.error)
    }
  } else {
    await db.inst().deleteFrom('follows').where('_uri', '=', _uri).execute()
  }
}
