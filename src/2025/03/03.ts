import { toDigitGrid } from '@/utils'

export function parse(input: string) {
  return toDigitGrid(input)
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce((total, bank) => total + getHighestJoltage(bank, 2), 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.reduce((total, bank) => total + getHighestJoltage(bank, 12), 0)
}

const getHighestJoltage = (bank: number[], batteries: number): number => {
  const batteryIdxs = new Array<number>(batteries).fill(0)
  for (let i = 0; i < batteryIdxs.length; ++i) {
    const start = (batteryIdxs[i - 1] ?? -1) + 1
    const end = bank.length - batteries + i + 1
    for (let j = start, max = 0; j < end; ++j) {
      if (bank[j]! > max) {
        batteryIdxs[i] = j
        max = bank[j]!
      }
    }
  }

  return Number(batteryIdxs.reduce((joltages, idx) => joltages + bank[idx], ''))
}
