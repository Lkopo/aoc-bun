import { Coords, sum } from '@/utils'

export function parse(input: string) {
  return input.split('\n\n').map(lines => {
    const [buttonA, buttonB, prize] = lines.split('\n')
    return {
      a: buttonA!.match(/\d+/g)!.map(Number) as Coords,
      b: buttonB!.match(/\d+/g)!.map(Number) as Coords,
      prize: prize!.match(/\d+/g)!.map(Number) as Coords
    } as MachineSetup
  })
}

export function partOne(input: ReturnType<typeof parse>) {
  return calculateTokens(input)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return calculateTokens(
    input.map(machineSetup => {
      machineSetup.prize[0] += 10000000000000
      machineSetup.prize[1] += 10000000000000
      return machineSetup
    })
  )
}

type MachineSetup = { a: Coords; b: Coords; prize: Coords }

const calculateTokens = (machines: MachineSetup[]): number =>
  machines
    .map(getCramerResults)
    .filter(areWholeNumbers)
    .map(([a, b]) => 3 * a + b)
    .reduce(sum)

const getCramerResults = (m: MachineSetup): [number, number] => [
  (m.prize[0] * m.b[1] - m.b[0] * m.prize[1]) /
    (m.a[0] * m.b[1] - m.b[0] * m.a[1]),
  (m.a[0] * m.prize[1] - m.prize[0] * m.a[1]) /
    (m.a[0] * m.b[1] - m.b[0] * m.a[1])
]

const areWholeNumbers = (numbers: number[]): boolean =>
  numbers.every(Number.isInteger)
