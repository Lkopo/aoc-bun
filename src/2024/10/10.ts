import {
  areCoordsValid,
  Coords,
  directions4,
  getCoordsKey,
  moveCoords,
  sum,
  toDigitGrid
} from '@/utils'

export function parse(input: string) {
  return toDigitGrid(input)
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce((total, row, y) => {
    row.forEach((height, x) => {
      if (height === 0) {
        const paths = new Map<string, number>()
        setPossiblePaths(input, [x, y], paths)
        total += paths.size
      }
    })
    return total
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.reduce((total, row, y) => {
    row.forEach((height, x) => {
      if (height === 0) {
        const paths = new Map<string, number>()
        setPossiblePaths(input, [x, y], paths)
        total += paths.values().reduce(sum)
      }
    })
    return total
  }, 0)
}

function setPossiblePaths(
  map: number[][],
  coords: Coords,
  paths: Map<string, number>
) {
  const currentValue = map[coords[1]]![coords[0]]!
  if (currentValue === 9) {
    const key = getCoordsKey(coords)
    paths.set(key, (paths.get(key) || 0) + 1)
    return
  }
  for (const dir of directions4) {
    const nextCoords: Coords = moveCoords(coords, dir)
    if (areCoordsValid(nextCoords, map.length - 1)) {
      const nextValue = map[nextCoords[1]]![nextCoords[0]]
      if (nextValue === currentValue + 1) {
        setPossiblePaths(map, nextCoords, paths)
      }
    }
  }
}
