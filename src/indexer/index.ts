import { jsonToLex } from '@atproto/api'
// @ts-ignore types not available
import * as measured from 'measured-core'
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
const stats = measured.createCollection()

indexer.user(onProfileUser)

indexer.record(async (evt) => {
  stats.meter('eventsPerSecond').mark()
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

setInterval(() => {
  console.log(stats.toJSON())
}, 1e3).unref()

export function start(url: string) {
  nexus = new Nexus(url)
  channel = nexus.channel(indexer)
  channel.start()
}

export async function addRepos(dids: string[]) {
  await nexus!.addRepos(dids)
}

export async function removeRepos(dids: string[]) {
  await nexus!.removeRepos(dids)
}

export async function destroy() {
  await channel?.destroy()
}
