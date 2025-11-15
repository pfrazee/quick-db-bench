import { RecordEvent } from '../../vendor/nexus/src'
import { AppBskyFeedLike } from '@atproto/api'
import * as db from '../../database.js'

export async function onLikeRecord(evt: RecordEvent) {
  const _uri = `at://${evt.did}/${evt.collection}/${evt.rkey}`
  if (evt.action === 'create' || evt.action === 'update') {
    const res = AppBskyFeedLike.validateRecord(evt.record)
    if (res.success) {
      const record = evt.record as AppBskyFeedLike.Record
      await db
        .inst()
        .insertInto('likes')
        .values({
          _uri,
          _repo: evt.did,
          _rkey: evt.rkey,
          subject: record.subject.uri,
          createdAt: new Date(record.createdAt),
        })
        .onDuplicateKeyUpdate({
          subject: record.subject.uri,
          createdAt: new Date(record.createdAt),
        })
        .execute()
    } else {
      console.error('invalid like record for', _uri)
      console.error(evt)
      console.error(res.error)
    }
  } else {
    await db.inst().deleteFrom('likes').where('_uri', '=', _uri).execute()
  }
}
