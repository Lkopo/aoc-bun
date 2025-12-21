import { directions8, toCharGrid } from '@/utils'

export function parse(input: string) {
  return toCharGrid(input)
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce((total, rolls, y) => {
    rolls.forEach((roll, x) => {
      if (roll !== '@') return
      const count = directions8.reduce((count, [dx, dy]) => {
        const next = [x + dx, y + dy]
        return count + (input[next[1]!]?.[next[0]!] === '@' ? 1 : 0)
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
    removed = input.reduce((total, rolls, y) => {
      rolls.forEach((roll, x) => {
        if (roll !== '@') return
        const count = directions8.reduce((count, [dx, dy]) => {
          const next = [x + dx, y + dy]
          return count + (input[next[1]!]?.[next[0]!] === '@' ? 1 : 0)
        }, 0)
        if (count < 4) {
          input[y]![x]! = 'x'
          ++total
        }
      })
      return total
    }, 0)
    totalRemoved += removed
  } while (removed > 0)
  return totalRemoved
}
