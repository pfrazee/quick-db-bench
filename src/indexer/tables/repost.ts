import { RecordEvent } from '../../vendor/nexus/src'
import { AppBskyFeedRepost } from '@atproto/api'
import * as db from '../../database.js'

export async function onRepostRecord(evt: RecordEvent) {
  const _uri = `at://${evt.did}/${evt.collection}/${evt.rkey}`
  if (evt.action === 'create' || evt.action === 'update') {
    const res = AppBskyFeedRepost.validateRecord(evt.record)
    if (res.success) {
      const record = evt.record as AppBskyFeedRepost.Record
      await db
        .inst()
        .insertInto('reposts')
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
      console.error('invalid repost record for', _uri)
      console.error(evt)
      console.error(res.error)
    }
  } else {
    await db.inst().deleteFrom('reposts').where('_uri', '=', _uri).execute()
  }
}
