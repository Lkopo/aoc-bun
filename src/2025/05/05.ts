import { Range } from '@/utils'

export function parse(input: string) {
  const [rangesLines, ingredientsLines] = input.split('\n\n')
  const ranges = optimizeRanges(
    sortRanges(
      rangesLines!.split('\n').map(line => {
        const [min, max] = line.split('-').map(Number)
        return [min, max] as Range
      })
    )
  )
  const ingredients = ingredientsLines!.split('\n').map(Number)
  return { ranges, ingredients }
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.ingredients.reduce(
    (total, ingredient) =>
      total + (fitsInRanges(ingredient, input.ranges) ? 1 : 0),
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.ranges.reduce((total, [min, max]) => total + (max - min + 1), 0)
}

const sortRanges = (ranges: Range[]): Range[] => {
  return ranges.sort(([min1], [min2]) => min1 - min2)
}

const optimizeRanges = (ranges: Range[]): Range[] => {
  const newRanges: Range[] = []
  let [min, max]: Range = ranges[0]!
  for (let i = 1; i < ranges.length; i++) {
    const [nextMin, nextMax] = ranges[i]!
    if (nextMin <= max + 1) max = Math.max(max, nextMax)
    else {
      newRanges.push([min, max])
      min = nextMin
      max = nextMax
    }
  }
  newRanges.push([min, max])
  return newRanges
}

const fitsInRanges = (ingredient: number, ranges: Range[]): boolean => {
  for (const [min, max] of ranges) {
    if (ingredient < min) return false
    if (ingredient <= max) return true
  }
  return false
}
