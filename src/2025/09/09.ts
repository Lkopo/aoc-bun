import { Coords } from '@/utils'

export function parse(input: string) {
  return input.split('\n').map(line => line.split(',').map(Number) as Coords)
}

export function partOne(input: ReturnType<typeof parse>) {
  let maxArea = 0
  for (let i = 0; i < input.length - 1; ++i) {
    const [ax, ay] = input[i]!
    for (let j = i + 1; j < input.length; ++j) {
      const [bx, by] = input[j]!
      maxArea = Math.max(
        maxArea,
        (Math.abs(ax - bx) + 1) * (Math.abs(ay - by) + 1)
      )
    }
  }
  return maxArea
}

export function partTwo(input: ReturnType<typeof parse>) {
  const lines = input.map((line, idx) => [
    line,
    input[(idx + 1) % input.length]!
  ]) as Line[]
  let maxArea = 0
  for (let i = 0; i < input.length - 1; ++i) {
    const [ax, ay] = input[i]!
    for (let j = i + 1; j < input.length; ++j) {
      const [bx, by] = input[j]!
      if (lines.some(line => isLineInRectangle(line, input[i]!, input[j]!)))
        continue
      maxArea = Math.max(
        maxArea,
        (Math.abs(ax - bx) + 1) * (Math.abs(ay - by) + 1)
      )
    }
  }
  return maxArea
}

type Line = [Coords, Coords]

const coordsOverlapInside = ([a1, a2]: Coords, [b1, b2]: Coords) =>
  Math.max(Math.min(a1, a2), Math.min(b1, b2)) <
  Math.min(Math.max(a1, a2), Math.max(b1, b2))

const isInside = (v: number, [a, b]: Coords) =>
  Math.min(a, b) < v && v < Math.max(a, b)

const isLineInRectangle = (
  [[l1x, l1y], [l2x, l2y]]: Line,
  [ax, ay]: Coords,
  [bx, by]: Coords
) => {
  if (l1x === l2x) {
    const x = l1x
    const linePart = [Math.min(l1y, l2y), Math.max(l1y, l2y)] as Coords
    return isInside(x, [ax, bx]) && coordsOverlapInside(linePart, [ay, by])
  }

  const y = l1y
  const linePart = [Math.min(l1x, l2x), Math.max(l1x, l2x)] as Coords
  return isInside(y, [ay, by]) && coordsOverlapInside(linePart, [ax, bx])
}
