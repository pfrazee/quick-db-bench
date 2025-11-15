import { RecordEvent } from '../../vendor/nexus/src'

export async function onThreadgateRecord(_evt: RecordEvent) {
  // const uri = `at://${evt.did}/${evt.collection}/${evt.rkey}`
  // if (evt.action === 'create' || evt.action === 'update') {
  //   console.log(
  //     `threadgate created/updated at ${uri}: ${JSON.stringify(evt.record)}`
  //   )
  // } else {
  //   console.log(`threadgate deleted at ${uri}`)
  // }
}
