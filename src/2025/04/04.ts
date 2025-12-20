import { directions8, toCharGrid } from '@/utils'

export function parse(input: string) {
  return toCharGrid(input)
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce((total, rolls, idx) => {
    rolls.forEach((roll, i) => {
      if (roll !== '@') return
      const count = directions8.reduce((count, [x, y]) => {
        const next = [idx + x, i + y]
        return count + (input[next[0]!]?.[next[1]!] === '@' ? 1 : 0)
      }, 0)
      if (count < 4) ++total
    })
    return total
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  let totalRemoved = 0
  let removed: number
  do {
    removed = input.reduce((total, rolls, idx) => {
      rolls.forEach((roll, i) => {
        if (roll !== '@') return
        const count = directions8.reduce((count, [x, y]) => {
          const next = [idx + x, i + y]
          return count + (input[next[0]!]?.[next[1]!] === '@' ? 1 : 0)
        }, 0)
        if (count < 4) {
          input[idx]![i]! = 'x'
          ++total
        }
      })
      return total
    }, 0)
    totalRemoved += removed
  } while (removed > 0)
  return totalRemoved
}
