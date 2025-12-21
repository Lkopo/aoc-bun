import { unzip } from 'lodash'

export function parse(input: string) {
  const lines = input.split('\n')
  const operators = [...lines.at(-1)!]
    .map(char => (char === '+' || char === '*' ? char : null))
    .filter(Boolean) as string[]
  const numbersLines = lines.slice(0, -1)
  return { numbersLines, operators }
}

export function partOne(input: ReturnType<typeof parse>) {
  const numbers = unzip(
    input.numbersLines.reduce((numbers, line, idx, { length }) => {
      numbers.push(line.matchAll(/\d+/g).toArray().map(Number))
      return numbers
    }, [] as number[][])
  )
  return computeNumbers(numbers, input.operators)
}

export function partTwo(input: ReturnType<typeof parse>) {
  const numbers = unzip(input.numbersLines.map(line => line.split('')))
    .map(column => Number(column.join('')))
    .join(',')
    .split('0')
    .map(nums => nums.split(',').map(Number).filter(Boolean))
  return computeNumbers(numbers, input.operators)
}

const computeNumbers = (numbers: number[][], operators: string[]): number =>
  numbers.reduce((totals, numbers, idx) => {
    const operator = operators[idx]!
    return (
      totals +
      numbers.reduce(
        (total, number) => compute[operator]!(total, number),
        operator === '*' ? 1 : 0
      )
    )
  }, 0)

const compute: Record<string, (left: number, right: number) => number> = {
  '+': (left, right) => left + right,
  '*': (left, right) => left * right
}
