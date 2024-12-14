export const toCharGrid = (input: string) =>
  input.split('\n').map(line => line.split(''))

export const toNumGrid = (input: string) =>
  input.split('\n').map(line => line.match(/\d+/g)!.map(Number))

export const toDigitGrid = (input: string) =>
  input.split('\n').map(line => line.split('').map(Number))

export type Range = [number, number]

export const positiveModulo = (value: number, modulus: number) =>
  ((value % modulus) + modulus) % modulus

export const isBetween = (x: number, [min, max]: Range) => x >= min && x <= max

export const sum = (total: number, value: number) => total + value

export const product = (total: number, value: number) => total * value

export type Coords = [number, number]

export type Direction = [-1 | 0 | 1, -1 | 0 | 1]

export const directions4: Direction[] = [
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 0]
]

export const directions8: Direction[] = [
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  ...directions4
]

export const getCoordsKey = (coords: Coords) => `${coords[0]}:${coords[1]}`

export const getCoordsNumKey = (coords: Coords) =>
  coords[0] * 1000000000000 + coords[1]

export const getCoordsDirKey = (coords: Coords, dir: Direction) =>
  `${getCoordsKey(coords)}|${getCoordsKey(dir)}`

export const parseCoordsKey = (coordsKey: string): Coords =>
  coordsKey.split(':').map(Number) as Coords

export const areCoordsSame = (a: Coords, b: Coords) =>
  a[0] === b[0] && a[1] === b[1]

export const areDirsSame = (a: Direction, b: Direction) =>
  a[0] === b[0] && a[1] === b[1]

export const getOppositeDirection = (dir: Direction): Direction =>
  [-dir[0], -dir[1]] as Direction

export const areCoordsValid = (coords: Coords, size: number) =>
  isBetween(coords[0], [0, size]) && isBetween(coords[1], [0, size])

export const moveCoords = (coords: Coords, dir: Direction): Coords => [
  coords[0] + dir[0],
  coords[1] + dir[1]
]

export const turnRight = (dir: Direction) => [-dir[1], dir[0]] as Direction

export const turnRightDiagonally = (dir: Direction): Direction =>
  [dir[0] - dir[1], dir[1] + dir[0]] as Direction
