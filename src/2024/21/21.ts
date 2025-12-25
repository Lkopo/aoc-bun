import { memoize } from '@/utils'

export function parse(input: string) {
  return input.split('\n')
}

export function partOne(input: ReturnType<typeof parse>) {
  return getComplexitySum(input, 2)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return getComplexitySum(input, 25)
}

const getComplexitySum = (codes: string[], directionalPadRobots: number) => {
  return codes.reduce(
    (total, code) =>
      total + getTotalPrice(code, directionalPadRobots) * parseInt(code),
    0
  )
}

const getTotalPrice = (code: string, maxDepth: number) => {
  let sequence = geDirPadSequenceForCode(code)
  let start: DirPad = 'A'
  return [...sequence].reduce(
    (total, end) =>
      total + getPathLength(start, (start = end as DirPad), 1, maxDepth),
    0
  )
}

const geDirPadSequenceForCode = (code: string) => {
  let start: NumPad = 'A'
  return [...code].reduce(
    (sequence, end) =>
      sequence + numericPadPaths[start][(start = end as NumPad)],
    ''
  )
}

const getPathLength = memoize(
  (start: DirPad, end: DirPad, depth: number, maxDepth: number): number => {
    const path = directionalPadPaths[start][end]
    if (depth === maxDepth) return path.length
    let newStart: DirPad = 'A'
    const total = [...path].reduce(
      (sum, newEnd) =>
        sum +
        getPathLength(
          newStart,
          (newStart = newEnd as DirPad),
          depth + 1,
          maxDepth
        ),
      0
    )
    return total
  },
  (start, end, depth, maxDepth) => `${start}|${end}|${depth}|${maxDepth}`
)

type DirPad = '^' | 'A' | '<' | 'v' | '>'
type NumPad = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A'

const directionalPadPaths = {
  '^': {
    '^': 'A',
    A: '>A',
    '<': 'v<A',
    v: 'vA',
    '>': 'v>A'
  },
  A: {
    '^': '<A',
    A: 'A',
    '<': 'v<<A',
    v: '<vA',
    '>': 'vA'
  },
  '<': {
    '^': '>^A',
    A: '>>^A',
    '<': 'A',
    v: '>A',
    '>': '>>A'
  },
  v: {
    '^': '^A',
    A: '^>A',
    '<': '<A',
    v: 'A',
    '>': '>A'
  },
  '>': {
    '^': '<^A',
    A: '^A',
    '<': '<<A',
    v: '<A',
    '>': 'A'
  }
}

const numericPadPaths = {
  '7': {
    '7': 'A',
    '8': '>A',
    '9': '>>A',
    '4': 'vA',
    '5': 'v>A',
    '6': 'v>>A',
    '1': 'vvA',
    '2': 'vv>A',
    '3': 'vv>>A',
    '0': '>vvvA',
    A: '>>vvvA'
  },
  '8': {
    '7': '<A',
    '8': 'A',
    '9': '>A',
    '4': '<vA',
    '5': 'vA',
    '6': 'v>A',
    '1': '<vvA',
    '2': 'vvA',
    '3': 'vv>A',
    '0': 'vvvA',
    A: 'vvv>A'
  },
  '9': {
    '7': '<<A',
    '8': '<A',
    '9': 'A',
    '4': '<<vA',
    '5': '<vA',
    '6': 'vA',
    '1': '<<vvA',
    '2': '<vvA',
    '3': 'vvA',
    '0': '<vvvA',
    A: 'vvvA'
  },
  '4': {
    '7': '^A',
    '8': '^>A',
    '9': '^>>A',
    '4': 'A',
    '5': '>A',
    '6': '>>A',
    '1': 'vA',
    '2': 'v>A',
    '3': 'v>>A',
    '0': '>vvA',
    A: '>>vvA'
  },
  '5': {
    '7': '<^A',
    '8': '^A',
    '9': '^>A',
    '4': '<A',
    '5': 'A',
    '6': '>A',
    '1': '<vA',
    '2': 'vA',
    '3': 'v>A',
    '0': 'vvA',
    A: 'vv>A'
  },
  '6': {
    '7': '<<^A',
    '8': '<^A',
    '9': '^A',
    '4': '<<A',
    '5': '<A',
    '6': 'A',
    '1': '<<vA',
    '2': '<vA',
    '3': 'vA',
    '0': '<vvA',
    A: 'vvA'
  },
  '1': {
    '7': '^^A',
    '8': '^^>A',
    '9': '^^>>A',
    '4': '^A',
    '5': '^>A',
    '6': '^>>A',
    '1': 'A',
    '2': '>A',
    '3': '>>A',
    '0': '>vA',
    A: '>>vA'
  },
  '2': {
    '7': '<^^A',
    '8': '^^A',
    '9': '^^>A',
    '4': '<^A',
    '5': '^A',
    '6': '^>A',
    '1': '<A',
    '2': 'A',
    '3': '>A',
    '0': 'vA',
    A: 'v>A'
  },
  '3': {
    '7': '<<^^A',
    '8': '<^^A',
    '9': '^^A',
    '4': '<<^A',
    '5': '<^A',
    '6': '^A',
    '1': '<<A',
    '2': '<A',
    '3': 'A',
    '0': '<vA',
    A: 'vA'
  },
  '0': {
    '7': '^^^<A',
    '8': '^^^A',
    '9': '^^^>A',
    '4': '^^<A',
    '5': '^^A',
    '6': '^^>A',
    '1': '^<A',
    '2': '^A',
    '3': '^>A',
    '0': 'A',
    A: '>A'
  },
  A: {
    '7': '^^^<<A',
    '8': '<^^^A',
    '9': '^^^A',
    '4': '^^<<A',
    '5': '<^^A',
    '6': '^^A',
    '1': '^<<A',
    '2': '<^A',
    '3': '^A',
    '0': '<A',
    A: 'A'
  }
}
