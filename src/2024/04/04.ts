import { directions8, isBetween, toCharGrid } from '@/utils'

export function parse(input: string) {
  return toCharGrid(input)
}

export function partOne(input: ReturnType<typeof parse>) {
  const search = 'XMAS'

  return input.reduce((total, signs, idx) => {
    let matches = 0
    signs.forEach((sign, i) => {
      if (sign !== 'X') {
        return
      }
      directions8.forEach(([x, y]) => {
        let word = 'X'
        let pos = 0
        let next = [idx + x, i + y]
        while (++pos < 4 && input[next[0]!]?.[next[1]!] === search[pos]) {
          word += input[next[0]!]![next[1]!]
          next[0]! += x
          next[1]! += y
        }
        matches += Number(word === search)
      })
    })
    return total + matches
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.reduce((total, signs, idx) => {
    return (
      total +
      signs.filter((sign, i) => {
        if (
          sign !== 'A' ||
          !isBetween(idx, [1, input.length - 2]) ||
          !isBetween(i, [1, input.length - 2])
        ) {
          return false
        }
        const left = input[idx - 1]![i - 1]! + sign + input[idx + 1]![i + 1]!
        const right = input[idx + 1]![i - 1]! + sign + input[idx - 1]![i + 1]!
        const xmasValues = ['MAS', 'SAM']
        return xmasValues.includes(left) && xmasValues.includes(right)
      }).length
    )
  }, 0)
}
