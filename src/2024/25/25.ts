import { toCharGrid } from '@/utils'
import { unzip } from 'lodash'

export function parse(input: string) {
  const schematics = input.split('\n\n').map(toCharGrid)
  return schematics.reduce(
    (breakdown, schema) => {
      const target = schema[0]![0] === '#' ? breakdown.locks : breakdown.keys
      target.push(
        unzip(schema).map(col => col.filter(cell => cell === '#').length - 1)
      )
      return breakdown
    },
    { locks: [] as number[][], keys: [] as number[][] }
  )
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.keys.reduce(
    (total, key) =>
      total +
      input.locks.filter(lock => key.every((k, i) => k + lock[i]! <= 5)).length,
    0
  )
}
