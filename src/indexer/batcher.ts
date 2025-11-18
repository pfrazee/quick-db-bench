export class Batcher<T> {
  queue: T[] = []
  limit = 1000

  constructor(limit = 1000) {
    this.limit = limit
  }

  async add(v: T, drain: (values: T[]) => Promise<void>) {
    this.queue.push(v)
    if (this.queue.length >= this.limit) {
      try {
        await drain(this.queue)
      } catch (e) {
        console.error(e)
      }
      this.queue.length = 0
    }
  }
}
