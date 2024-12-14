import {
  Coords,
  getCoordsNumKey,
  isBetween,
  positiveModulo,
  product,
  Range,
  Vector
} from '@/utils'

export function parse(input: string) {
  return input
    .split('\n')
    .map(line => line.match(/-?\d+/g)!.map(Number))
    .map(
      ([pX, pY, vX, vY]) =>
        ({
          p: [pX, pY],
          v: [vX, vY],
          q: -1
        }) as Robot
    )
}

export function partOne(input: ReturnType<typeof parse>) {
  const [width, height, seconds] = [101, 103, 100]
  const widthHalves = [
    [0, Math.floor(width / 2) - 1],
    [Math.ceil(width / 2), width - 1]
  ] as [Range, Range]
  const heightHalves = [
    [0, Math.floor(height / 2) - 1],
    [Math.ceil(height / 2), height - 1]
  ] as [Range, Range]
  const quadrants: Quadrant[] = widthHalves.flatMap(widthHalf =>
    heightHalves.map(heightHalf => [widthHalf, heightHalf])
  )
  input.forEach(robot => {
    robot.p = moveRobot(robot, seconds, width, height)
    robot.q = getQuadrantForPoint(robot.p, quadrants)
  })
  const robotsPerQuadrant = Object.groupBy(
    input.filter(robot => robot.q !== -1),
    ({ q }) => q
  )
  return quadrants
    .map((_, idx) => robotsPerQuadrant[idx]?.length ?? 1)
    .reduce(product)
}

export function partTwo(input: ReturnType<typeof parse>) {
  const [width, height, seconds] = [101, 103, 10000]
  const printResult = false // set to true for debugging
  for (let s = 1; s < seconds; ++s) {
    const positions = new Set(
      input.map(robot => {
        robot.p = moveRobot(robot, 1, width, height)
        return getCoordsNumKey(robot.p)
      })
    )
    for (let y = 0; y < height; ++y) {
      let row = ''
      for (let x = 0; x < width; ++x) {
        row += positions.has(getCoordsNumKey([x, y])) ? '#' : '.'
      }
      if (printResult) {
        console.log(row)
      } else if (row.includes('###############################')) {
        return s
      }
    }
    if (printResult) {
      console.log(s.toString())
    }
  }
}

type Quadrant = [Range, Range]
type Robot = { p: Coords; v: Vector; q: number }

const moveRobot = (
  robot: Robot,
  seconds: number,
  width: number,
  height: number
): Coords => [
  positiveModulo(robot.p[0] + robot.v[0] * seconds, width),
  positiveModulo(robot.p[1] + robot.v[1] * seconds, height)
]

const getQuadrantForPoint = (p: Coords, quadrants: Quadrant[]) => {
  return quadrants.findIndex(
    quadrant =>
      isBetween(p[0], [quadrant[0][0], quadrant[0][1]]) &&
      isBetween(p[1], [quadrant[1][0], quadrant[1][1]])
  )
}
