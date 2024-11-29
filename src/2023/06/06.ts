export function parse(input: string) {
  return input
    .split('\n')
    .map(line => line.match(/\d+/g)!.map(value => parseInt(value)))
    .reduce((races: Race[], row, idx, rows) => {
      if (idx === 1) {
        const times = rows[0]
        row.forEach((distance, i) => {
          races.push({ time: times![i]!, distance })
        })
      }
      return races
    }, [])
}

export function partOne(input: ReturnType<typeof parse>) {
  return input.reduce(
    (total: number, race: Race) =>
      total * getNumberOfWays(race.time, race.distance),
    1
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  const [time, distance] = input.reduce(
    ([time, distance], race: Race) => {
      return [time + race.time.toString(), distance + race.distance.toString()]
    },
    ['', '']
  )

  return getNumberOfWays(parseInt(time), parseInt(distance))
}

type Race = {
  time: number
  distance: number
}

function getNumberOfWays(time: number, distance: number): number {
  const sqrtDisc = Math.sqrt(time ** 2 - 4 * distance)
  const min = (time - sqrtDisc) / 2
  const max = (time + sqrtDisc) / 2

  return Number.isInteger(max - min)
    ? max - min - 1
    : Math.floor(max) - Math.ceil(min) + 1
}
