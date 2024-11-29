export function parse(input: string) {
  return input.split('\n')
}

export function partOne(input: ReturnType<typeof parse>) {
  return input
    .map(line => line.match(/\d/g))
    .reduce((total, numbers) => {
      return total + parseInt(numbers![0]! + numbers!.at(-1)!)
    }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.reduce((total: number, line: string) => {
    const regexPattern = 'one|two|three|four|five|six|seven|eight|nine|ten'
    const firstNumbers = line.match(new RegExp(`(\\d|${regexPattern})`))
    const lastNumbers = reverseString(line).match(
      new RegExp(`(\\d|${reverseString(regexPattern)})`)
    )
    const firstNumber = firstNumbers![0]!
    const lastNumber = reverseString(lastNumbers![0]!)
    return total + parseInt(parseNumber(firstNumber) + parseNumber(lastNumber))
  }, 0)
}

function reverseString(input: string): string {
  return input.split('').reverse().join('')
}

function parseNumber(input: string): string {
  const parsedInt = parseInt(input)
  if (!Number.isNaN(parsedInt)) {
    return input
  }
  const mapping: Record<string, string> = {
    one: '1',
    two: '2',
    three: '3',
    four: '4',
    five: '5',
    six: '6',
    seven: '7',
    eight: '8',
    nine: '9',
    ten: '10'
  }
  const regex = new RegExp(Object.keys(mapping).join('|'))
  return input.replace(regex, match => mapping[match]!)
}
