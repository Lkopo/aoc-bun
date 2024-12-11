import {
  areCoordsSame,
  areCoordsValid,
  Coords,
  Direction,
  getCoordsDirKey,
  getCoordsKey,
  moveCoords,
  toCharGrid
} from '@/utils'

export function parse(input: string) {
  const map = toCharGrid(input)
  const y = map.findIndex(row => row.includes('^'))
  const startPos: Coords = [map[y]!.indexOf('^'), y]
  return { map, startPos }
}

export function partOne(input: ReturnType<typeof parse>) {
  const size = input.map.length - 1
  const visited: Set<string> = new Set([getCoordsKey(input.startPos)])
  let direction: Direction = [0, -1]
  let next = input.startPos
  while (true) {
    const nextPos = moveCoords(next, direction)
    if (!areCoordsValid(nextPos, size)) {
      break
    }
    const item = input.map[nextPos[1]]![nextPos[0]]
    if (item === '#') {
      direction = turnRight(direction)
    } else {
      next = nextPos
      visited.add(getCoordsKey(nextPos))
    }
  }
  return visited.size
}

export function partTwo(input: ReturnType<typeof parse>) {
  const obstacles: Map<string, boolean> = new Map()
  const size = input.map.length - 1
  let next = input.startPos
  let direction: Direction = [0, -1]
  while (true) {
    const nextPos = moveCoords(next, direction)
    if (!areCoordsValid(nextPos, size)) {
      break
    }
    const item = input.map[nextPos[1]]![nextPos[0]]
    if (item === '#') {
      direction = turnRight(direction)
    } else {
      const nextPosKey = getCoordsKey(nextPos)
      if (
        !areCoordsSame(input.startPos, nextPos) &&
        !obstacles.has(nextPosKey)
      ) {
        obstacles.set(nextPosKey, isLoop(input.map, next, direction))
      }
      next = nextPos
    }
  }
  return [...obstacles.values()].filter(Boolean).length
}

function isLoop(
  map: string[][],
  startPos: Coords,
  startDir: Direction
): boolean {
  const startNextPos = moveCoords(startPos, startDir)
  map[startNextPos[1]]![startNextPos[0]] = '#'
  const size = map.length - 1
  const visited: Set<string> = new Set()
  let next = startPos
  let direction = turnRight(startDir)
  let nextPos: Coords
  while (true) {
    nextPos = moveCoords(next, direction)
    const posDirKey = getCoordsDirKey(nextPos, direction)
    if (!areCoordsValid(nextPos, size) || visited.has(posDirKey)) {
      break
    }
    const item = map[nextPos[1]]![nextPos[0]]
    if (item === '#') {
      direction = turnRight(direction)
    } else {
      next = nextPos
      visited.add(posDirKey)
    }
  }
  map[startNextPos[1]]![startNextPos[0]] = '.'
  return areCoordsValid(nextPos, size)
}

const turnRight = (dir: Direction) => [-dir[1], dir[0]] as Direction
