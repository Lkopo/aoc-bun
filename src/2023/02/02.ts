export function parse(input: string) {
  return input.split('\n')
}

export function partOne(input: ReturnType<typeof parse>) {
  const allowedConfiguration: Record<string, number> = {
    blue: 14,
    red: 12,
    green: 13
  }

  return input.reduce((total: number, line: string) => {
    const [gameIdStr, gameRounds] = line.split(':')
    const gameId = parseInt(gameIdStr!.match(/\d+/)![0]!)

    const isValid = gameRounds!
      .split(';')
      .flatMap(gameRound => gameRound.match(/\d+\s(blue|red|green)/g))
      .every(setting => {
        const [count, type] = setting!.split(/\s/)
        return parseInt(count!) <= allowedConfiguration[type!]!
      })

    return isValid ? total + gameId : total
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.reduce((total: number, line: string) => {
    const [gameIdStr, gameRounds] = line.split(':')
    const gameId = parseInt(gameIdStr!.match(/\d+/)![0]!)
    const minimumConfiguration: Record<string, number> = {}

    gameRounds!
      .split(';')
      .flatMap(gameRound => gameRound.match(/\d+\s(blue|red|green)/g))
      .forEach(setting => {
        const [count, type] = setting!.split(/\s/)
        minimumConfiguration[type!] = Math.max(
          minimumConfiguration[type!]! || 0,
          parseInt(count!)
        )
      })

    return (
      total +
      Object.values(minimumConfiguration).reduce(
        (configTotal, value) => (configTotal *= value),
        1
      )
    )
  }, 0)
}
