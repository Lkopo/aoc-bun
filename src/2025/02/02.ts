export function parse(input: string) {
  return input.split(',').reduce((ranges, line) => {
    const [left, right] = line.split('-')
    ranges.push({
      startId: Number(left),
      endId: Number(right)
    })

    return ranges
  }, [] as Range[])
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce((total, range) => {
    for (let id = range.startId; id <= range.endId; ++id) {
      if (!isValid(String(id))) total += id
    }
    return total
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.reduce((total, range) => {
    for (let id = range.startId; id <= range.endId; ++id) {
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

  for (const char of id.split('')) {
    sequence += char
    if (sequence.length > id.length / 2) return true
    if (id.length % sequence.length !== 0) continue
    const testId = sequence.repeat(id.length / sequence.length)

    if (testId === id) return false
  }

  return true
}

type Range = {
  startId: number,
  endId: number,
}
