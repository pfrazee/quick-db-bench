import { RecordEvent, UserEvent } from '../../vendor/nexus/src'
import * as db from '../../database.js'
import { AppBskyActorProfile } from '@atproto/api'

export async function onProfileUser(evt: UserEvent) {
  if (evt.handle) {
    await db
      .inst()
      .insertInto('profiles')
      .values({
        _repo: evt.did,
        handle: evt.handle,
      })
      .onDuplicateKeyUpdate({
        handle: evt.handle,
      })
      .execute()
    console.log('Updated handle for', evt.did, 'to', evt.handle)
  }
}

export async function onProfileRecord(evt: RecordEvent) {
  if (evt.action === 'create' || evt.action === 'update') {
    const res = AppBskyActorProfile.validateRecord(evt.record)
    if (res.success) {
      const record = evt.record as AppBskyActorProfile.Record
      await db
        .inst()
        .insertInto('profiles')
        .values({
          _repo: evt.did,
          handle: evt.did,
          displayName: record.displayName || '',
          description: record.description || '',
          createdAt: new Date(record.createdAt || ''),
        })
        .onDuplicateKeyUpdate({
          displayName: record.displayName || '',
          description: record.description || '',
          createdAt: new Date(record.createdAt || ''),
        })
        .execute()
    } else {
      console.error('invalid profile record for', evt.did)
      console.error(evt)
      console.error(res.error)
    }
  } else {
    await db
      .inst()
      .deleteFrom('profiles')
      .where('_repo', '=', evt.did)
      .execute()
  }
}
