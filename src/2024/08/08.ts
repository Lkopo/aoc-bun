import { isBetween } from 'scripts/utils'

export function parse(input: string) {
  const lines = input.split('\n')
  const sattelites = lines.reduce((map, line, y) => {
    const chars = line.split('').forEach((char, x) => {
      if (char !== '.') {
        map.set(char, [...(map.get(char) || []), [x, y]])
      }
    })
    return map
  }, new Map<string, Coords[]>())
  return { sattelites, size: lines.length - 1 }
}

export function partOne(input: ReturnType<typeof parse>) {
  const antiNodes = new Set<string>()
  input.sattelites.forEach(coordsList => {
    coordsList.forEach((coordsA, idxA) => {
      coordsList.forEach((coordsB, idxB) => {
        if (idxA !== idxB) {
          const oppositeCoords = getOppositeCoords(coordsA, coordsB)
          if (isValidCoords(oppositeCoords, input.size)) {
            antiNodes.add(getCoordsKey(oppositeCoords))
          }
        }
      })
    })
  })
  return antiNodes.size
}

export function partTwo(input: ReturnType<typeof parse>) {
  const antiNodes = new Set<string>()
  input.sattelites.forEach(coordsList => {
    coordsList.forEach((coordsA, idxA) => {
      antiNodes.add(getCoordsKey(coordsA))
      coordsList.forEach((coordsB, idxB) => {
        if (idxA !== idxB) {
          let [first, second] = [coordsA, coordsB]
          let oppositeCoords = getOppositeCoords(first, second)
          while (isValidCoords(oppositeCoords, input.size)) {
            antiNodes.add(getCoordsKey(oppositeCoords))
            second = first
            first = oppositeCoords
            oppositeCoords = getOppositeCoords(first, second)
          }
        }
      })
    })
  })
  return antiNodes.size
}

type Coords = [number, number]

const getOppositeCoords = (a: Coords, b: Coords): Coords => [
  a[0] + a[0] - b[0],
  a[1] + a[1] - b[1]
]

const isValidCoords = (coords: Coords, size: number): boolean =>
  isBetween(coords[0], [0, size]) && isBetween(coords[1], [0, size])

const getCoordsKey = (coords: Coords): string => `${coords[0]}:${coords[1]}`
