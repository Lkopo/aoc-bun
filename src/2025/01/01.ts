export function parse(input: string) {
  return input.split('\n').map(line => {
    const [, direction, rotation] = line.match(/(L|R)(\d+)/)!
    return direction === 'L' ? -Number(rotation) : Number(rotation)
  })
}

export function partOne(input: ReturnType<typeof parse>) {
  let dial = 50
  return input.reduce((total, rotation) => {
    dial += rotation
    return total + (dial % 100 === 0 ? 1 : 0)
  }, 0)
}

export function partTwo(input: ReturnType<typeof parse>) {
  let dial = 50
  return input.reduce((total, rotation) => {
    const nextDial = dial + rotation
    const roundFunc = rotation > 0 ? Math.ceil : Math.floor
    dial = nextDial
    return (
      total +
      Math.abs(
        roundFunc(nextDial / 100) - roundFunc((nextDial - rotation) / 100)
      )
    )
  }, 0)
}
