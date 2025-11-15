import { jsonToLex } from '@atproto/api'
import {
  Nexus,
  NexusChannel,
  SimpleIndexer,
} from '../vendor/nexus/src/index.js'
import { onFollowRecord } from './tables/follow.js'
import { onLikeRecord } from './tables/like.js'
import { onPostRecord } from './tables/post.js'
import { onProfileUser, onProfileRecord } from './tables/profile.js'
import { onRepostRecord } from './tables/repost.js'
import { onThreadgateRecord } from './tables/threadgate.js'

let nexus: Nexus | null = null
let channel: NexusChannel | null = null
const indexer = new SimpleIndexer()

indexer.user(onProfileUser)

indexer.record(async (evt) => {
  evt.record = evt.record
    ? (jsonToLex(evt.record) as Record<string, unknown>)
    : undefined
  switch (evt.collection) {
    case 'app.bsky.actor.profile':
      return onProfileRecord(evt)
    case 'app.bsky.feed.post':
      return onPostRecord(evt)
    case 'app.bsky.feed.like':
      return onLikeRecord(evt)
    case 'app.bsky.feed.repost':
      return onRepostRecord(evt)
    case 'app.bsky.feed.threadgate':
      return onThreadgateRecord(evt)
    case 'app.bsky.graph.follow':
      return onFollowRecord(evt)
  }
})

indexer.error((err) => console.error(err))

export function start(url: string) {
  const nexus = new Nexus(url)
  const channel = nexus.channel(indexer)
  channel.start()
}

export async function addRepos(dids: string[]) {
  await nexus?.addRepos(dids)
}

export async function removeRepos(dids: string[]) {
  await nexus?.removeRepos(dids)
}

export async function destroy() {
  await channel?.destroy()
}
