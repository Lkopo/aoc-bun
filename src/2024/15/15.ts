import {
  Coords,
  getCoordsKey,
  getCharCoords,
  moveCoords,
  toCharGrid,
  Vector
} from '@/utils'

export function parse(input: string) {
  const [mapInput, instructions] = input.split('\n\n')
  const map = toCharGrid(mapInput!)
  const extendedMap = toCharGrid(
    mapInput!
      .replace(/#/g, '##')
      .replace(/O/g, '[]')
      .replace(/\./g, '..')
      .replace(/@/g, '@.')
  )
  return {
    map: map,
    extendedMap: extendedMap,
    startCoords: getCharCoords(map, '@'),
    startCoordsExtended: getCharCoords(extendedMap, '@'),
    instructions: instructions!
      .split('\n')
      .join('')
      .split('') as DirectionSign[]
  }
}

export function partOne(input: ReturnType<typeof parse>) {
  let robotCoords = input.startCoords
  input.map[robotCoords[1]]![robotCoords[0]]! = '.'
  for (const instruction of input.instructions) {
    const direction = directionSignMap[instruction]!
    const futureCoords = moveCoords(robotCoords, direction)
    const futureValue = input.map[futureCoords[1]]![futureCoords[0]]
    if (
      futureValue === '.' ||
      (futureValue === 'O' && moveBoxesV1(input.map, robotCoords, direction))
    ) {
      robotCoords = futureCoords
    }
  }
  return input.map.reduce(
    (total, row, y) =>
      total +
      row.reduce(
        (rowTotal, tile, x) => rowTotal + (tile === 'O' ? x + 100 * y : 0),
        0
      ),
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  let robotCoords = input.startCoordsExtended
  input.extendedMap[robotCoords[1]]![robotCoords[0]]! = '.'
  const boxes = new Set<Box>()
  const boxMap = new Map<string, Box>()
  input.extendedMap.forEach((row, y) => {
    row.forEach((tile, x) => {
      if (tile === '[') {
        const box = { coords: [x, y] as Coords } as Box
        boxMap.set(getCoordsKey([x, y]), box)
        boxMap.set(getCoordsKey([x + 1, y]), box)
        boxes.add(box)
        input.extendedMap[y]![x] = '.'
        input.extendedMap[y]![x + 1] = '.'
      }
    })
  })
  boxes.forEach(box => scanBoxSurroundings(input.extendedMap, box, boxMap))
  for (const instruction of input.instructions) {
    const direction = directionSignMap[instruction]!
    const futureCoords = moveCoords(robotCoords, direction)
    const futureValue = input.extendedMap[futureCoords[1]]![futureCoords[0]]
    const futureBox = boxMap.get(getCoordsKey(futureCoords))
    if (
      futureValue !== '#' &&
      (!futureBox ||
        moveBoxesV2(input.extendedMap, futureBox, instruction, boxMap))
    ) {
      robotCoords = futureCoords
    }
  }
  return boxes
    .values()
    .reduce((total, box) => total + box.coords[0] + 100 * box.coords[1], 0)
}

type Box = {
  coords: Coords
  '>': Box | string
  '<': Box | string
  v: (Box | string)[]
  '^': (Box | string)[]
}
type DirectionSign = '>' | 'v' | '<' | '^'

const directionSignMap: Record<DirectionSign, Vector> = {
  '>': [1, 0],
  v: [0, 1],
  '<': [-1, 0],
  '^': [0, -1]
}

const moveBoxesV1 = (map: string[][], coords: Coords, dir: Vector): boolean => {
  let nextCoords = moveCoords(coords, dir)
  const initialCoords = [...nextCoords] as Coords
  while (map[nextCoords[1]]![nextCoords[0]] === 'O') {
    nextCoords = moveCoords(nextCoords, dir)
  }
  if (map[nextCoords[1]]![nextCoords[0]] === '.') {
    map[nextCoords[1]]![nextCoords[0]] = 'O'
    map[initialCoords[1]]![initialCoords[0]] = '.'
    return true
  }
  return false
}

const moveBoxesV2 = (
  map: string[][],
  box: Box,
  dirSign: DirectionSign,
  boxMap: Map<string, Box>
): boolean => {
  if (!isMovePossible(box, dirSign)) {
    return false
  }

  const processedBoxes = new Set<Box>()
  const boxesToScan = new Set<Box>()
  const queue = [box]

  while (queue.length) {
    const box = queue.pop()!
    if (processedBoxes.has(box)) continue
    processedBoxes.add(box)
    boxesToScan.add(box)

    boxMap.delete(getCoordsKey(box.coords))
    boxMap.delete(getCoordsKey([box.coords[0] + 1, box.coords[1]]))
    box.coords = moveCoords(box.coords, directionSignMap[dirSign])

    Object.keys(directionSignMap).forEach(sign => {
      const nextCoords = moveCoords(
        box.coords,
        directionSignMap[sign as DirectionSign]
      )
      const nextCoordsKey = getCoordsKey(nextCoords)
      boxMap.has(nextCoordsKey) && boxesToScan.add(boxMap.get(nextCoordsKey)!)
      if (sign !== '<') {
        const rightCoordsKey = getCoordsKey([nextCoords[0] + 1, nextCoords[1]])
        boxMap.has(rightCoordsKey) &&
          boxesToScan.add(boxMap.get(rightCoordsKey)!)
      }
      if (sign === 'v' || sign === '^') {
        const [left, right] = box[sign]
        typeof left === 'object' && boxesToScan.add(left)
        typeof right === 'object' && boxesToScan.add(right)
      } else {
        const neighbor = box[sign as '<' | '>']
        typeof neighbor === 'object' && boxesToScan.add(neighbor)
      }
    })

    if (dirSign === 'v' || dirSign === '^') {
      const [left, right] = box[dirSign]
      typeof left === 'object' && queue.push(left)
      left !== right && typeof right === 'object' && queue.push(right)
    } else {
      const neighbor = box[dirSign]
      typeof neighbor === 'object' && queue.push(neighbor)
    }
  }

  processedBoxes.forEach(box => {
    boxMap.set(getCoordsKey(box.coords), box)
    boxMap.set(getCoordsKey([box.coords[0] + 1, box.coords[1]]), box)
  })
  boxesToScan.forEach(box => scanBoxSurroundings(map, box, boxMap))

  return true
}

const isMovePossible = (box: Box, dirSign: DirectionSign): boolean => {
  if (dirSign === 'v' || dirSign === '^') {
    const [left, right] = box[dirSign]
    return (
      (typeof left === 'object'
        ? isMovePossible(left, dirSign)
        : left !== '#') &&
      (left !== right
        ? typeof right === 'object'
          ? isMovePossible(right, dirSign)
          : right !== '#'
        : true)
    )
  }
  const neighbor = box[dirSign]
  return typeof neighbor === 'object'
    ? isMovePossible(neighbor, dirSign)
    : neighbor !== '#'
}

const scanBoxSurroundings = (
  map: string[][],
  box: Box,
  boxMap: Map<string, Box>
) => {
  Object.keys(directionSignMap).forEach(sign => {
    const nextCoords = moveCoords(
      box.coords,
      directionSignMap[sign as DirectionSign]
    )
    if (sign === '>') {
      const nextCoordsMoved = [nextCoords[0] + 1, nextCoords[1]] as Coords
      box[sign] =
        boxMap.get(getCoordsKey(nextCoordsMoved)) ??
        map[nextCoordsMoved[1]]![nextCoordsMoved[0]]!
    } else if (sign === '<') {
      box[sign] =
        boxMap.get(getCoordsKey(nextCoords)) ??
        map[nextCoords[1]]![nextCoords[0]]!
    } else {
      const nextCoordsRight = [nextCoords[0] + 1, nextCoords[1]] as Coords
      box[sign as '^' | 'v'] = [
        boxMap.get(getCoordsKey(nextCoords)) ??
          map[nextCoords[1]]![nextCoords[0]]!,
        boxMap.get(getCoordsKey(nextCoordsRight)) ??
          map[nextCoordsRight[1]]![nextCoordsRight[0]]!
      ]
    }
  })
}
