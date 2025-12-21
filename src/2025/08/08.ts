import { product } from '@/utils'

export function parse(input: string) {
  return input.split('\n').map(line => line.split(',').map(Number) as XyzCoords)
}

export function partOne(input: ReturnType<typeof parse>) {
  const circuits = new Map<number, number>()
  const closestBoxes = getClosestBoxes(input)
  for (let i = 0; i < 1000; ++i) {
    const [box1Idx, box2Idx] = closestBoxes[i]!
    updateCircuits(box1Idx, box2Idx, i, circuits)
  }
  return Object.entries(Object.groupBy(circuits.values(), v => v))
    .map(([, v]) => v!.length)
    .sort((a, b) => b - a)
    .slice(0, 3)
    .reduce(product)
}

export function partTwo(input: ReturnType<typeof parse>) {
  const circuits = new Map<number, number>()
  const closestBoxes = getClosestBoxes(input)
  for (let i = 0; i < input.length; ++i) {
    circuits.set(i, i)
  }
  let i = 0
  let box1Idx,
    box2Idx = undefined
  while (new Set(circuits.values()).size > 1) {
    ;[box1Idx, box2Idx] = closestBoxes[i]!
    updateCircuits(box1Idx, box2Idx, i, circuits)
    ++i
  }
  return input[box1Idx!]![0] * input[box2Idx!]![0]
}

type XyzCoords = [number, number, number]
type BoxDistance = [number, number, number]

export const getClosestBoxes = (boxes: XyzCoords[]): BoxDistance[] => {
  const distances = [] as BoxDistance[]
  for (let i = 0; i < boxes.length - 1; ++i) {
    const [x, y, z] = boxes[i] as XyzCoords
    for (let j = i + 1; j < boxes.length; ++j) {
      const [cx, cy, cz] = boxes[j] as XyzCoords
      const newDistance = Math.sqrt(
        Math.pow(x - cx, 2) + Math.pow(y - cy, 2) + Math.pow(z - cz, 2)
      )
      distances.push([i, j, newDistance])
    }
  }
  distances.sort(([, , d1], [, , d2]) => d1 - d2)
  return distances
}

export const updateCircuits = (
  box1Idx: number,
  box2Idx: number,
  idx: number,
  circuits: Map<number, number>
) => {
  const c1 = circuits.get(box1Idx)
  const c2 = circuits.get(box2Idx)

  if (c1 !== undefined || c2 !== undefined) {
    const target = c1 ?? c2!

    circuits.set(box1Idx, target)
    circuits.set(box2Idx, target)

    if (c1 !== undefined && c2 !== undefined && c1 !== c2) {
      for (const [k, v] of circuits) {
        if (v === c2) circuits.set(k, c1)
      }
    }
  } else {
    circuits.set(box1Idx, idx)
    circuits.set(box2Idx, idx)
  }
}
