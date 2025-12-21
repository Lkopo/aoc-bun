import { Range } from '@/utils'

export function parse(input: string) {
  return input.split(',').reduce((ranges, line) => {
    const [left, right] = line.split('-')
    ranges.push([Number(left), Number(right)])
    return ranges
  }, [] as Range[])
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce((total, [min, max]) => {
    for (let id = min; id <= max; ++id) {
      if (!isValid(String(id))) total += id
    }
    return total
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.reduce((total, [min, max]) => {
    for (let id = min; id <= max; ++id) {
      if (!isValidComplex(String(id))) total += id
    }
    return total
  }, 0)
}

const isValid = (id: string): boolean => {
  if (id.length % 2 === 1) return true

  const [left, right] = [id.slice(0, id.length / 2), id.slice(id.length / 2)]

  return left !== right
}

const isValidComplex = (id: string): boolean => {
  let sequence = ''

  for (let i = 0; i < id.length; ++i) {
    sequence += id[i]
    if (sequence.length > id.length / 2) return true
    if (id.length % sequence.length !== 0) continue
    if (isRepeatedBy(id, sequence)) return false
  }

  return true
}

const isRepeatedBy = (id: string, sequence: string): boolean => {
  for (let i = 0; i < id.length; i++) {
    if (id[i] !== sequence[i % sequence.length]) return false
  }
  return true
}
