import {
  Coords,
  directions4,
  getCoordsKey,
  moveCoords,
  parseCoordsKey,
  toCharGrid,
  turnRight,
  turnRightDiagonally
} from '@/utils'

export function parse(input: string) {
  return toCharGrid(input)
}

export function partOne(input: ReturnType<typeof parse>) {
  const regions: Set<string>[] = []
  setRegions(input, regions)

  return regions.reduce(
    (total, region) =>
      total +
      region.size *
        [...region].reduce(
          (perimeter, plot) =>
            perimeter +
            directions4.filter(
              dir =>
                !region.has(getCoordsKey(moveCoords(parseCoordsKey(plot), dir)))
            ).length,
          0
        ),
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  const regions: Set<string>[] = []
  setRegions(input, regions)

  return regions.reduce(
    (total, region) =>
      total +
      region.size *
        [...region].reduce(
          (walls, plot) => walls + getCorners(parseCoordsKey(plot), region),
          0
        ),
    0
  )
}

const setRegions = (map: string[][], regions: Set<string>[]) => {
  const visited = new Set<string>()
  map.forEach((row, y) => {
    row.forEach((plot, x) => {
      const startCoords: Coords = [x, y]
      if (visited.has(getCoordsKey(startCoords))) return
      const queue: Coords[] = [startCoords]
      const region = new Set<string>()
      while (queue.length) {
        const coords = queue.pop()!
        const coordsKey = getCoordsKey(coords)
        region.add(coordsKey)
        visited.add(coordsKey)
        for (const dir of directions4) {
          const nextCoords = moveCoords(coords, dir)
          if (
            !visited.has(getCoordsKey(nextCoords)) &&
            map[nextCoords[1]]?.[nextCoords[0]] === plot
          ) {
            queue.push(nextCoords)
          }
        }
      }
      regions.push(region)
    })
  })
}

const getCorners = (coords: Coords, region: Set<string>): number =>
  directions4.reduce((total, dir) => {
    const [front, right, diagRight] = [
      dir,
      turnRight(dir),
      turnRightDiagonally(dir)
    ].map(dir => region.has(getCoordsKey(moveCoords(coords, dir))))
    return (
      total + ((!front && !right) || (front && right && !diagRight) ? 1 : 0)
    )
  }, 0)
