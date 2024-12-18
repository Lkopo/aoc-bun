import {
  areCoordsSame,
  areCoordsValid,
  Coords,
  directions4,
  getCoordsKey,
  getCoordsNumKey,
  moveCoords
} from '@/utils'
import Heap from 'heap-js'

export function parse(input: string) {
  return input
    .split('\n')
    .map(line => getCoordsKey(line.match(/\d+/g)!.map(Number) as Coords))
}

export function partOne(input: ReturnType<typeof parse>) {
  return getMinDistance(70, new Set(input.slice(0, 1024)))
}

export function partTwo(input: ReturnType<typeof parse>) {
  let left = 1024
  let right = input.length - 1
  while (left < right - 1) {
    const middle = Math.floor((left + right) / 2)
    const corruptedBytes = new Set(input.slice(0, middle))
    if (getMinDistance(70, corruptedBytes) === Infinity) {
      right = middle
    } else {
      left = middle
    }
  }
  return input[left]!.replace(':', ',')
}

const getMinDistance = (wh: number, corruptedBytes: Set<string>) => {
  const queue = new Heap<Step>(
    (stepA, stepB) => stepA.distance - stepB.distance
  )
  const visited = new Set<number>()
  let minDistance = Infinity
  queue.push({ coords: [0, 0], distance: 0 })
  while (!queue.isEmpty()) {
    const step = queue.pop()!
    if (step.distance >= minDistance) continue
    const coordsKey = getCoordsNumKey(step.coords)
    if (visited.has(coordsKey)) continue
    visited.add(coordsKey)
    if (areCoordsSame([wh, wh], step.coords)) {
      minDistance = Math.min(minDistance, step.distance)
      continue
    }
    directions4.forEach(direction => {
      const nextCoords = moveCoords(step.coords, direction)
      if (
        !corruptedBytes.has(getCoordsKey(nextCoords)) &&
        areCoordsValid(nextCoords, wh)
      ) {
        queue.push({ coords: nextCoords, distance: step.distance + 1 })
      }
    })
  }
  return minDistance
}

type Step = { coords: Coords; distance: number }
