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
      calculate(symbols, numbers[0]!, numbers.slice(1)).has(value)
        ? total + value
        : total,
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  const symbols = ['+', '*', '||']
  return input.reduce(
    (total, { value, numbers }) =>
      calculate(symbols, numbers[0]!, numbers.slice(1)).has(value)
        ? total + value
        : total,
    0
  )
}

const compute: Record<string, (left: number, right: number) => number> = {
  '+': (left, right) => left + right,
  '*': (left, right) => left * right,
  '||': (left, right) => parseInt(left.toString() + right.toString())
}

function calculate(
  symbols: string[],
  left: number,
  rightValues: number[],
  index: number = 0,
  results: Set<number> = new Set()
): Set<number> {
  if (index === rightValues.length) {
    results.add(left)
    return results
  }

  symbols.forEach(symbol => {
    const value = compute[symbol]!(left, rightValues[index]!)
    calculate(symbols, value, rightValues, index + 1, results)
  })

  return results
}
