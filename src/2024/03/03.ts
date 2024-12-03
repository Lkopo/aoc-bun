export function parse(input: string) {
  return input
    .matchAll(/(mul|do|don\'t)\((\d+)?,?(\d+)?\)/g)
    .toArray()
    .map(regexArr => ({
      type: regexArr[1]!,
      left: regexArr[2] ? parseInt(regexArr[2]) : null,
      right: regexArr[3] ? parseInt(regexArr[3]) : null
    }))
}

export function partOne(input: ReturnType<typeof parse>) {
  return input
    .filter(instruction => instruction.type === 'mul')
    .reduce(
      (total, instruction) => total + instruction.left! * instruction.right!,
      0
    )
}

export function partTwo(input: ReturnType<typeof parse>) {
  let mulEnabled = true
  return input.reduce((total, instruction) => {
    if (instruction.type !== 'mul') {
      mulEnabled = instruction.type === 'do'
    }
    return mulEnabled
      ? total + (instruction.left ?? 0) * (instruction.right ?? 0)
      : total
  }, 0)
}
