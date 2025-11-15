import { RecordEvent } from '../../vendor/nexus/src'
import { AppBskyFeedPost } from '@atproto/api'
import * as db from '../../database.js'

export async function onPostRecord(evt: RecordEvent) {
  const _uri = `at://${evt.did}/${evt.collection}/${evt.rkey}`
  if (evt.action === 'create' || evt.action === 'update') {
    const res = AppBskyFeedPost.validateRecord(evt.record)
    if (res.success) {
      const record = evt.record as AppBskyFeedPost.Record
      await db
        .inst()
        .insertInto('posts')
        .values({
          _uri,
          _repo: evt.did,
          _rkey: evt.rkey,
          text: record.text,
          replyTo: record.reply?.parent?.uri,
          createdAt: new Date(record.createdAt),
        })
        .onDuplicateKeyUpdate({
          text: record.text,
          replyTo: record.reply?.parent?.uri,
          createdAt: new Date(record.createdAt),
        })
        .execute()
    } else {
      console.error('invalid post record for', _uri)
      console.error(evt)
      console.error(res.error)
    }
  } else {
    await db.inst().deleteFrom('posts').where('_uri', '=', _uri).execute()
  }
}
