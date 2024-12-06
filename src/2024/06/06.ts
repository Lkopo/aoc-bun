import { isBetween } from 'scripts/utils'

export function parse(input: string) {
  const map = input.split('\n').map(line => line.split(''))
  let startPos: Coords = [-1, -1]
  map.forEach((row, y) => {
    const x = row.indexOf('^')
    if (x === -1) {
      return
    }
    startPos = [x, y]
  })
  return { map, startPos }
}

export function partOne(input: ReturnType<typeof parse>) {
  const size = input.map.length - 1
  const visited: Set<string> = new Set([getPosKey(input.startPos)])
  let direction: Coords = [0, -1]
  let next = input.startPos
  while (true) {
    const nextPos = move(next, direction)
    if (!isValidPos(nextPos, size)) {
      break
    }
    const item = input.map[nextPos[1]]![nextPos[0]]
    if (item === '#') {
      direction = turnRight(direction)
    } else {
      next = nextPos
      visited.add(getPosKey(nextPos))
    }
  }
  return visited.size
}

export function partTwo(input: ReturnType<typeof parse>) {
  const obstacles: Map<string, boolean> = new Map()
  const size = input.map.length - 1
  let next = input.startPos
  let direction: Coords = [0, -1]
  while (true) {
    const nextPos = move(next, direction)
    if (!isValidPos(nextPos, size)) {
      break
    }
    const item = input.map[nextPos[1]]![nextPos[0]]
    if (item === '#') {
      direction = turnRight(direction)
    } else {
      const nextPosKey = getPosKey(nextPos)
      if (!arePosSame(input.startPos, nextPos) && !obstacles.has(nextPosKey)) {
        obstacles.set(nextPosKey, isLoop(input.map, next, direction))
      }
      next = nextPos
    }
  }
  return Array.from(obstacles.values()).filter(Boolean).length
}

function isLoop(map: string[][], startPos: Coords, startDir: Coords): boolean {
  const startNextPos = move(startPos, startDir)
  map[startNextPos[1]]![startNextPos[0]] = '#'
  const size = map.length - 1
  const visited: Set<string> = new Set()
  let next = startPos
  let direction = turnRight(startDir)
  let nextPos: Coords
  while (true) {
    nextPos = move(next, direction)
    const posDirKey = getPosDirKey(nextPos, direction)
    if (!isValidPos(nextPos, size) || visited.has(posDirKey)) {
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
  return isValidPos(nextPos, size)
}

type Coords = [number, number]

const isValidPos = (pos: Coords, size: number): boolean =>
  isBetween(pos[0], [0, size]) && isBetween(pos[1], [0, size])

const arePosSame = (pos1: Coords, pos2: Coords): boolean =>
  getPosKey(pos1) === getPosKey(pos2)

const getPosKey = (pos: Coords): string => `${pos[0]}:${pos[1]}`

const getPosDirKey = (pos: Coords, dir: Coords): string =>
  `${getPosKey(pos)}|${getPosKey(dir)}`

const move = (pos: Coords, dir: Coords): Coords => [
  pos[0] + dir[0],
  pos[1] + dir[1]
]

const turnRight = (dir: Coords): Coords => [-dir[1], dir[0]]
