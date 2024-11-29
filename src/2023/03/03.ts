export function parse(input: string) {
  return input.split('\n').reduce(
    (result: MapInfo, line: string, idx: number) => {
      const numbers: MapNumber[] = line
        .matchAll(/\d+/g)
        .toArray()
        .map(regexValue => ({
          row: idx,
          value: parseInt(regexValue[0]),
          startPosition: regexValue.index,
          endPosition: regexValue.index + regexValue[0].length - 1
        }))
      const symbols: MapSymbol[] = line
        .matchAll(/[^\d.]/g)
        .toArray()
        .map(regexValue => ({
          row: idx,
          value: regexValue[0],
          position: regexValue.index
        }))
      result.numbers.push(...numbers)
      result.symbols.push(...symbols)

      return result
    },
    { numbers: [], symbols: [] }
  )
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.numbers.reduce((total: number, number: MapNumber) => {
    const isValid = input.symbols.some(
      symbol =>
        symbol.row >= number.row - 1 &&
        symbol.row <= number.row + 1 &&
        symbol.position >= number.startPosition - 1 &&
        symbol.position <= number.endPosition + 1
    )

    return isValid ? total + number.value : total
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.symbols
    .filter(symbol => symbol.value === '*')
    .reduce((total: number, symbol: MapSymbol) => {
      const adjacentNumbers = input.numbers
        .filter(
          number =>
            symbol.row >= number.row - 1 &&
            symbol.row <= number.row + 1 &&
            symbol.position >= number.startPosition - 1 &&
            symbol.position <= number.endPosition + 1
        )
        .map(number => number.value)

      return adjacentNumbers.length === 2
        ? total + adjacentNumbers[0]! * adjacentNumbers[1]!
        : total
    }, 0)
}

type MapNumber = {
  row: number
  value: number
  startPosition: number
  endPosition: number
}

type MapSymbol = {
  row: number
  value: string
  position: number
}

type MapInfo = {
  numbers: MapNumber[]
  symbols: MapSymbol[]
}
