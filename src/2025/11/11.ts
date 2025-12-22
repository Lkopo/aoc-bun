import Queue from '@/queue'

export function parse(input: string) {
  return input.split('\n').reduce((schema, line) => {
    const [device, outputSchema] = line.split(': ')
    schema.set(device!, outputSchema!.split(' '))
    return schema
  }, new Map<string, string[]>())
}

export function partOne(input: ReturnType<typeof parse>) {
  const queue = new Queue<{ device: string }>()
  queue.enqueue({ device: 'you' })
  let paths = 0
  while (!queue.isEmpty()) {
    const { device } = queue.dequeue()!
    if (device === 'out') {
      ++paths
      continue
    }
    for (const next of input.get(device)!) {
      queue.enqueue({ device: next })
    }
  }
  return paths
}

export function partTwo(input: ReturnType<typeof parse>) {
  return getValidPathsCount(input, 'svr', false, false)
}

const cache = new Map<string, number>()

const getValidPathsCount = (
  schema: Map<string, string[]>,
  device: string,
  hasDac: boolean,
  hasFft: boolean
): number => {
  const key = device + hasDac + hasFft
  if (cache.has(key)) return cache.get(key)!
  if (device === 'out') {
    const result = hasDac && hasFft ? 1 : 0
    cache.set(key, result)
    return result
  }
  const result = schema
    .get(device)!
    .reduce(
      (total, next) =>
        total +
        getValidPathsCount(
          schema,
          next,
          hasDac || next === 'dac',
          hasFft || next === 'fft'
        ),
      0
    )
  cache.set(key, result)
  return result
}
