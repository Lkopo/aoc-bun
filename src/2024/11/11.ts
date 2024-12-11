import { sum } from '@/utils'

export function parse(input: string) {
  return input
    .split(' ')
    .reduce(
      (map, value) => appendMapKey(map, value, 1),
      new Map<string, number>()
    )
}

export function partOne(input: ReturnType<typeof parse>) {
  return countStones(input, 25)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return countStones(input, 75)
}

function countStones(stonesMap: Map<string, number>, blinks: number): number {
  let total = stonesMap.values().reduce(sum)
  for (let i = 0; i < blinks; ++i) {
    const entries = [...stonesMap.entries()]
    entries.forEach(([value, count]) => {
      const currentDiff = stonesMap.get(value)! - count
      currentDiff === 0
        ? stonesMap.delete(value)
        : stonesMap.set(value, currentDiff)
      if (value === '0') {
        appendMapKey(stonesMap, '1', count)
      } else if (value.length % 2 === 0) {
        const length = value.length / 2
        const [left, right] = [
          value.slice(0, length),
          String(Number(value.slice(length)))
        ]
        appendMapKey(stonesMap, left, count)
        appendMapKey(stonesMap, right, count)
        total += count
      } else {
        const multiplied = String(Number(value) * 2024)
        appendMapKey(stonesMap, multiplied, count)
      }
    })
  }
  return total
}

const appendMapKey = (
  map: Map<string, number>,
  key: string,
  value: number
): Map<string, number> => map.set(key, (map.get(key) || 0) + value)
