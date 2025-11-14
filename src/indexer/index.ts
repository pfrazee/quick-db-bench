import { Nexus, NexusChannel, SimpleIndexer } from '../vendor/nexus/src'

let nexus: Nexus | null = null
let channel: NexusChannel | null = null
const indexer = new SimpleIndexer()

indexer.record(async (evt) => {
  const uri = `at://${evt.did}/${evt.collection}/${evt.rkey}`
  if (evt.action === 'create' || evt.action === 'update') {
    console.log(
      `record created/updated at ${uri}: ${JSON.stringify(evt.record)}`
    )
  } else {
    console.log(`record deleted at ${uri}`)
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
