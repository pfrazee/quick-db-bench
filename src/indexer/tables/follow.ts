import { RecordEvent } from '../../vendor/nexus/src'
import { AppBskyGraphFollow } from '@atproto/api'
import * as db from '../../database.js'

export async function onFollowRecord(evt: RecordEvent) {
  const _uri = `at://${evt.did}/${evt.collection}/${evt.rkey}`
  if (evt.action === 'create' || evt.action === 'update') {
    const res = AppBskyGraphFollow.validateRecord(evt.record)
    if (res.success) {
      const record = evt.record as AppBskyGraphFollow.Record
      await db
        .inst()
        .insertInto('follows')
        .values({
          _uri,
          _repo: evt.did,
          _rkey: evt.rkey,
          subject: record.subject,
          createdAt: new Date(record.createdAt),
        })
        .onDuplicateKeyUpdate({
          subject: record.subject,
          createdAt: new Date(record.createdAt),
        })
        .execute()
    } else {
      console.error('invalid follow record', _uri)
      console.error(evt)
      console.error(res.error)
    }
  } else {
    await db.inst().deleteFrom('follows').where('_uri', '=', _uri).execute()
  }
}
