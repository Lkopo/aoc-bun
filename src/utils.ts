export const toCharGrid = (input: string) =>
  input.split('\n').map(line => line.split(''))

export const toNumGrid = (input: string) =>
  input.split('\n').map(line => line.match(/\d+/g)!.map(Number))

export const toDigitGrid = (input: string) =>
  input.split('\n').map(line => line.split('').map(Number))

export type Range = [number, number]

export const positiveModulo = (value: number, modulus: number) =>
  (modulus + (value % modulus)) % modulus

export const isBetween = (x: number, [min, max]: Range) => x >= min && x <= max

export const sum = (total: number, value: number) => total + value

export const product = (total: number, value: number) => total * value

export type Coords = [number, number]

export type Vector = [number, number]

export const directions4: Vector[] = [
  [0, 1],
  [-1, 0],
  [0, -1],
  [1, 0]
]

export const directions8: Vector[] = [
  [1, 1],
  [-1, -1],
  [1, -1],
  [-1, 1],
  ...directions4
]

export const getCoordsKey = (coords: Coords) => `${coords[0]}:${coords[1]}`

export const getCoordsNumKey = (coords: Coords) => coords[0] * 10000 + coords[1]

export const getCoordsVectKey = (coords: Coords, vector: Vector) =>
  `${getCoordsKey(coords)}|${getCoordsKey(vector)}`

export const parseCoordsKey = (coordsKey: string): Coords =>
  coordsKey.split(':').map(Number) as Coords

export const areCoordsSame = (a: Coords, b: Coords) =>
  a[0] === b[0] && a[1] === b[1]

export const areVectorsSame = (a: Vector, b: Vector) =>
  a[0] === b[0] && a[1] === b[1]

export const getOppositeVector = (vector: Vector): Vector =>
  [-vector[0], -vector[1]] as Vector

export const areCoordsValid = (coords: Coords, size: number) =>
  isBetween(coords[0], [0, size]) && isBetween(coords[1], [0, size])

export const moveCoords = (coords: Coords, vector: Vector): Coords => [
  coords[0] + vector[0],
  coords[1] + vector[1]
]

export const getCharCoords = (grid: string[][], char: string): Coords => {
  const y = grid.findIndex(row => row.includes(char))
  return [grid[y]!.indexOf(char), y]
}

export const turnRight = (vector: Vector) => [-vector[1], vector[0]] as Vector

export const turnRightDiagonally = (vector: Vector): Vector =>
  [vector[0] - vector[1], vector[1] + vector[0]] as Vector

export const memoize = <A extends any[], R, K>(
  fn: (...args: A) => R,
  keyOf: (...args: A) => K
) => {
  const cache = new Map<K, R>()
  return (...args: A): R => {
    const key = keyOf(...args)
    const hit = cache.get(key)
    if (hit !== undefined) return hit
    const res = fn(...args)
    cache.set(key, res)
    return res
  }
}
