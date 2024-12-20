// https://gist.github.com/tbjgolden/142f2e0b2c1670812959e3588c4fa8a2

class Queue<T> {
  private readonly queue: T[]
  private start: number
  private end: number

  constructor(array: T[] = []) {
    this.queue = array
    this.start = 0
    this.end = array.length
  }

  isEmpty() {
    return this.end === this.start
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error('Queue is empty.')
    } else {
      return this.queue[this.start++]
    }
  }

  enqueue(value: T) {
    this.queue.push(value)
    this.end += 1
  }

  [Symbol.iterator]() {
    let index = this.start
    return {
      next: () =>
        index < this.end
          ? {
              value: this.queue[index++]
            }
          : { done: true }
    }
  }
}

export default Queue
