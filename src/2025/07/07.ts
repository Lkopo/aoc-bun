import {
  areCoordsValid,
  Coords,
  getCharCoords,
  getCoordsNumKey,
  memoize,
  toCharGrid
} from '@/utils'

export function parse(input: string) {
  return toCharGrid(input)
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce(
    (total, line, y) =>
      total +
      line.reduce(
        (splits, char, x) =>
          splits + (char === '^' && canBeSplit([x, y], input) ? 1 : 0),
        0
      ),
    1
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  return getTimelines(getCharCoords(input, 'S'), input)
}

const getTimelines = memoize(
  ([x, y]: Coords, manifold: string[][]): number => {
    if (!areCoordsValid([x, y], manifold.length - 1)) return 0
    for (let ny = y + 1; ny < manifold.length; ++ny) {
      if (manifold[ny]![x] === '^') {
        const timelines =
          getTimelines([x - 1, ny], manifold) +
          getTimelines([x + 1, ny], manifold)
        return timelines
      }
    }
    return 1
  },
  coords => getCoordsNumKey(coords)
)

const canBeSplit = ([x, y]: Coords, manifold: string[][]): boolean => {
  for (let ny = y - 1; ny > 0; --ny) {
    if (manifold[ny]![x] === '^') return false
    if (manifold[ny]![x - 1] === '^' || manifold[ny]![x + 1] === '^')
      return true
  }
  return false
}
