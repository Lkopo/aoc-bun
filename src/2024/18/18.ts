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
  return solveMaze(70, new Set(input.slice(0, 1024))).minDistance
}

export function partTwo(input: ReturnType<typeof parse>) {
  const corruptedBytes = new Set(input.slice(0, 1025))
  let i = 0
  let solvedMaze = solveMaze(70, corruptedBytes)
  let nextCorruptedByte = input[1024]
  while (solvedMaze.winner !== null) {
    const winningPath = new Set<string>()
    for (
      let current = solvedMaze.winner;
      current !== null;
      current = current.previous!
    ) {
      winningPath.add(getCoordsKey(current.coords))
    }
    do {
      nextCorruptedByte = input[1024 + ++i]!
      corruptedBytes.add(nextCorruptedByte)
    } while (!winningPath.has(nextCorruptedByte))
    solvedMaze = solveMaze(70, corruptedBytes)
  }
  return nextCorruptedByte!.replace(':', ',')
}

const solveMaze = (wh: number, corrupted: Set<string>) => {
  const queue = new Heap<Step>(
    (stepA, stepB) => stepA.distance - stepB.distance
  )
  const visited = new Set<number>()
  let minDistance = Infinity
  let winner: Step | null = null
  queue.push({ coords: [0, 0], distance: 0, previous: null })
  while (!queue.isEmpty()) {
    const step = queue.pop()!
    if (step.distance >= minDistance) continue
    const coordsKey = getCoordsNumKey(step.coords)
    if (visited.has(coordsKey)) continue
    visited.add(coordsKey)
    if (areCoordsSame([wh, wh], step.coords)) {
      if (step.distance < minDistance) {
        minDistance = step.distance
        winner = step
      }
      continue
    }
    directions4.forEach(direction => {
      const nextCoords = moveCoords(step.coords, direction)
      if (
        !corrupted.has(getCoordsKey(nextCoords)) &&
        areCoordsValid(nextCoords, wh)
      ) {
        queue.push({
          coords: nextCoords,
          distance: step.distance + 1,
          previous: step
        })
      }
    })
  }
  return { minDistance, winner }
}

type Step = {
  coords: Coords
  distance: number
  previous: Step | null
}
