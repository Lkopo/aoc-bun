import { isBetween } from 'scripts/utils'

export function parse(input: string) {
  return input.split('\n').map(line => line.split('').map(Number))
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
        total += paths.values().reduce((total, value) => total + value, 0)
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
  const directions: Coords[] = [
    [0, 1],
    [-1, 0],
    [0, -1],
    [1, 0]
  ]
  for (const dir of directions) {
    const nextCoords: Coords = [coords[0] + dir[0], coords[1] + dir[1]]
    if (isValidCoords(nextCoords, map.length - 1)) {
      const nextValue = map[nextCoords[1]]![nextCoords[0]]
      if (nextValue === currentValue + 1) {
        setPossiblePaths(map, nextCoords, paths)
      }
    }
  }
}

type Coords = [number, number]

const isValidCoords = (coords: Coords, size: number): boolean =>
  isBetween(coords[0], [0, size]) && isBetween(coords[1], [0, size])

const getCoordsKey = (coords: Coords): string => `${coords[0]}:${coords[1]}`
