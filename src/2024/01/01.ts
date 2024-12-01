export function parse(input: string) {
  return input
    .split('\n')
    .map(line => line.match(/\d+/g)!.map(Number))
    .reduce(
      (lists, [left, right]) => {
        lists.left.push(left!)
        lists.right.push(right!)
        return lists
      },
      { left: [] as number[], right: [] as number[] }
    )
}

export function partOne(input: ReturnType<typeof parse>) {
  const [sortedLeft, sortedRight] = [input.left.sort(), input.right.sort()]
  return sortedLeft.reduce(
    (total, value, idx) => total + Math.abs(value - sortedRight[idx]!),
    0
  )
}

export function partTwo(input: ReturnType<typeof parse>) {
  return input.left.reduce(
    (total, value) =>
      total + value * input.right.filter(val => val === value).length,
    0
  )
}
