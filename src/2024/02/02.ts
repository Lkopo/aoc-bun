import { isBetween } from 'scripts/utils'

export function parse(input: string) {
  return input.split('\n').map(line => line.match(/\d+/g)!.map(Number))
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce(
    (total, values) => (isValid(values) ? total + 1 : total),
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.reduce((total, values) => {
    return values.some((_, idx) => isValid(values.filter((_, i) => i !== idx)))
      ? total + 1
      : total
  }, 0)
}

function isValid(values: number[]): boolean {
  const sign = Math.sign(values[0]! - values[1]!)
  return values.slice(0, -1).every((value, idx) => {
    const diff = value - values[idx + 1]!
    return Math.sign(diff) === sign && isBetween(Math.abs(diff), [1, 3])
  })
}
