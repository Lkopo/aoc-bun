export function parse(input: string) {
  return input.split('\n').map(line => {
    const [value, numbers] = line.split(':')
    return {
      value: parseInt(value!),
      numbers: numbers!.match(/\d+/g)!.map(Number)
    }
  })
}

export function partOne(input: ReturnType<typeof parse>) {
  const symbols = ['+', '*']
  return input.reduce(
    (total, { value, numbers }) =>
      getResults(symbols, numbers[0]!, numbers, 1, new Set()).has(value)
        ? total + value
        : total,
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  const symbols = ['+', '*', '||']
  return input.reduce(
    (total, { value, numbers }) =>
      getResults(symbols, numbers[0]!, numbers, 1, new Set()).has(value)
        ? total + value
        : total,
    0
  )
}

const compute: Record<string, (left: number, right: number) => number> = {
  '+': (left, right) => left + right,
  '*': (left, right) => left * right,
  '||': (left, right) => left * 10 ** Math.floor(Math.log10(right) + 1) + right
}

function getResults(
  symbols: string[],
  left: number,
  rightValues: number[],
  idx: number,
  results: Set<number>
): Set<number> {
  if (idx === rightValues.length) {
    results.add(left)
    return results
  }

  for (const symbol of symbols) {
    const value = compute[symbol]!(left, rightValues[idx]!)
    getResults(symbols, value, rightValues, idx + 1, results)
  }

  return results
}
