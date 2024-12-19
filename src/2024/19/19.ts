import { sum } from '@/utils'

export function parse(input: string) {
  const [patternsPart, designsPart] = input.split('\n\n')
  const patterns = patternsPart!
    .match(/\w+/g)!
    .sort((a, b) => b.length - a.length)
  const designs = designsPart!.split('\n')
  return { patterns, designs }
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.designs
    .map(design => getPossibleDesignCount(design, input.patterns))
    .filter(count => count > 0).length
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.designs
    .map(design => getPossibleDesignCount(design, input.patterns))
    .reduce(sum)
}

const cache = new Map<string, number>()
const getPossibleDesignCount = (design: string, patterns: string[]): number => {
  if (design === '') return 1
  if (cache.has(design)) return cache.get(design)!
  let result = 0
  for (const pattern of patterns) {
    if (design.startsWith(pattern)) {
      result += getPossibleDesignCount(design.slice(pattern.length), patterns)
    }
  }
  cache.set(design, result)
  return result
}
