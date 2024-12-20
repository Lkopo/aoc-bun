import {
  Coords,
  getCoordsNumKey,
  getCoordsVectKey,
  getCharCoords,
  moveCoords,
  toCharGrid,
  turnRight,
  Vector
} from '@/utils'
import Heap from 'heap-js'

export function parse(input: string) {
  const map = toCharGrid(input)
  return { map, startCoords: getCharCoords(map, 'S') }
}

export function partOne(input: ReturnType<typeof parse>) {
  const queue = new Heap<Step>((stepA, stepB) => stepA.score - stepB.score)
  const visited = new Set<string>()
  let minScore = Infinity
  queue.push({ coords: input.startCoords, direction: [1, 0], score: 0 })
  while (!queue.isEmpty()) {
    const step = queue.pop()!
    if (step.score > minScore) continue
    const coordsDirKey = getCoordsVectKey(step.coords, step.direction)
    if (visited.has(coordsDirKey)) continue
    visited.add(coordsDirKey)
    if (input.map[step.coords[1]]![step.coords[0]] === 'E') {
      minScore = Math.min(minScore, step.score)
      continue
    }
    getMoves(step.direction).forEach(([dir, points]) => {
      const nextCoords = moveCoords(step.coords, dir)
      if (input.map[nextCoords[1]]![nextCoords[0]] !== '#') {
        queue.push({
          coords: nextCoords,
          direction: dir,
          score: step.score + points
        })
      }
    })
  }
  return minScore
}

export function partTwo(input: ReturnType<typeof parse>) {
  const queue = new Heap<Step>((stepA, stepB) => stepA.score - stepB.score)
  const visited = new Map<string, number>()
  let minScore = Infinity
  let winningSteps: Step[] = []
  queue.push({
    coords: input.startCoords,
    direction: [1, 0],
    score: 0,
    previous: null
  })
  while (!queue.isEmpty()) {
    const step = queue.pop()!
    if (step.score > minScore) continue
    const coordsDirKey = getCoordsVectKey(step.coords, step.direction)
    if (step.score > (visited.get(coordsDirKey) ?? Infinity)) continue
    visited.set(coordsDirKey, step.score)
    if (input.map[step.coords[1]]![step.coords[0]] === 'E') {
      if (step.score < minScore) {
        minScore = step.score
        winningSteps = [step]
      } else if (step.score === minScore) {
        winningSteps.push(step)
      }
      continue
    }
    getMoves(step.direction).forEach(([dir, points]) => {
      const nextCoords = moveCoords(step.coords, dir)
      if (input.map[nextCoords[1]]![nextCoords[0]] !== '#') {
        queue.push({
          coords: nextCoords,
          direction: dir,
          score: step.score + points,
          previous: step
        })
      }
    })
  }
  const winningTiles = new Set<number>()
  winningSteps.forEach(step => {
    for (let current = step; current !== null; current = current.previous!) {
      winningTiles.add(getCoordsNumKey(current.coords))
    }
  })
  return winningTiles.size
}

type Step = {
  coords: Coords
  direction: Vector
  score: number
  previous?: Step | null
}

const getMoves = (direction: Vector): [Vector, number][] => [
  [direction, 1],
  [turnRight(direction), 1001],
  [turnLeft(direction), 1001]
]

const turnLeft = (vector: Vector): Vector => [vector[1], -vector[0]]
