import Queue from '@/queue'
import {
  areCoordsValid,
  Coords,
  directions4,
  getCoordsNumKey,
  getCharCoords,
  moveCoords,
  toCharGrid
} from '@/utils'

export function parse(input: string) {
  return toCharGrid(input)
}

export function partOne(input: ReturnType<typeof parse>) {
  return getCheatDistances(input, 2)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return getCheatDistances(input, 20)
}

const getCheatDistances = (map: string[][], maxCheatLength: number) => {
  const endCoords = getCharCoords(map, 'E')
  const startDistMap = buildDistMapForCoords(map, getCharCoords(map, 'S'))
  const endDistMap = buildDistMapForCoords(map, endCoords)
  const fairDistance = startDistMap.get(getCoordsNumKey(endCoords))!
  const cheats = new Set<number>()

  map.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === '#') return
      const startKey = getCoordsNumKey([x, y])
      const startDist = startDistMap.get(startKey)!
      const queue = new Queue<{ coords: Coords; steps: number }>()
      queue.enqueue({ coords: [x, y] as Coords, steps: 0 })
      const visited = new Set<number>()
      while (!queue.isEmpty()) {
        const { coords, steps } = queue.dequeue()!
        const coordsKey = getCoordsNumKey(coords)
        if (visited.has(coordsKey)) continue
        visited.add(coordsKey)
        if (map[coords[1]]![coords[0]] !== '#') {
          const dist = startDist + steps + endDistMap.get(coordsKey)!
          if (fairDistance - dist >= 100) {
            cheats.add(startKey * 1000000 + coordsKey)
          }
        }
        if (steps < maxCheatLength) {
          for (const direction of directions4) {
            const nextCoords = moveCoords(coords, direction)
            const nextKey = getCoordsNumKey(nextCoords)
            if (
              !visited.has(nextKey) &&
              areCoordsValid(nextCoords, map.length - 1)
            ) {
              queue.enqueue({ coords: nextCoords, steps: steps + 1 })
            }
          }
        }
      }
    })
  })
  return cheats.size
}

const buildDistMapForCoords = (map: string[][], coords: Coords) => {
  const queue = new Queue<{ coords: Coords; distance: number }>()
  queue.enqueue({ coords, distance: 0 })
  const visited = new Set<number>()
  const distMap = new Map<number, number>()
  while (!queue.isEmpty()) {
    const { coords, distance } = queue.dequeue()!
    const key = getCoordsNumKey(coords)
    visited.add(key)
    distMap.set(key, distance)
    for (const direction of directions4) {
      const nextCoords = moveCoords(coords, direction)
      if (
        !visited.has(getCoordsNumKey(nextCoords)) &&
        map[nextCoords[1]]![nextCoords[0]] !== '#'
      ) {
        queue.enqueue({ coords: nextCoords, distance: distance + 1 })
      }
    }
  }
  return distMap
}
