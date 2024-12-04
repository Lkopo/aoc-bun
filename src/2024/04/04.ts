import { unzip } from 'lodash'
import { isBetween } from 'scripts/utils'

export function parse(input: string) {
  return input.split('\n').map(line => line.split(''))
}

export function partOne(input: ReturnType<typeof parse>) {
  const leftRight = input.map(signs => signs.join(''))
  const topDown = unzip(input).map(signs => signs.join(''))
  const rightLeft = mirrorMatrix(leftRight)
  const topDownReversed = unzip(rightLeft.map(line => line.split(''))).map(
    signs => signs.join('')
  )

  return findOccurrences(
    leftRight,
    topDown,
    diagonalValues(topDown),
    diagonalValues(topDownReversed)
  )
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

function mirrorMatrix(input: string[]): string[] {
  return input.map(line => line.split('').reverse().join(''))
}

function diagonalValues(input: string[]): string[] {
  const values = []
  const length = input.length
  for (let i = 3; i < length; ++i) {
    let signs = input[0]![i]!
    for (let j = i - 1; j >= 0; --j) {
      signs += input[i - j]![j]!
    }
    values.push(signs)
  }
  for (let i = 1; i < length - 3; ++i) {
    let signs = input[i]![length - 1]!
    for (let j = length - 2; j >= 0 && i + length - j - 1 < length; --j) {
      signs += input[i + length - j - 1]![j]!
    }
    values.push(signs)
  }
  return values
}

function findOccurrences(...inputs: string[][]): number {
  return inputs
    .flat()
    .reduce(
      (total, line) => total + (line.match(/(?=(XMAS|SAMX))/g)?.length ?? 0),
      0
    )
}
