export function parse(input: string) {
  const [registersPart, programPart] = input.split('\n\n')
  const registers = registersPart!
    .split('\n')
    .map(line => line.match(/\d+/)!.map(BigInt)[0])
  return {
    a: registers[0]!,
    b: registers[1]!,
    c: registers[2]!,
    program: programPart!.split(' ')[1]!.split(',')!.map(Number)
  } as Computer
}

export function partOne(input: ReturnType<typeof parse>) {
  return execute(input)
}

export function partTwo(input: ReturnType<typeof parse>) {
  const expectedResult = input.program.join(',')
  const candidates: number[] = []
  const queue: bigint[] = []
  const processed = new Set<bigint>()
  for (let i = 0n; i < 8n; ++i) {
    input.a = i
    const result = execute(input)
    if (expectedResult.endsWith(result)) {
      queue.push(i)
    }
  }
  while (queue.length) {
    const initialA = queue.pop()!
    if (processed.has(initialA)) continue
    processed.add(initialA)
    for (let i = 0n; i < 8n; ++i) {
      const newA = initialA * 8n + i
      input.a = newA
      const result = execute(input)
      if (result === expectedResult) {
        candidates.push(Number(newA))
      } else if (expectedResult.endsWith(result)) {
        queue.push(newA)
      }
    }
  }
  return Math.min(...candidates)
}

type Computer = { a: bigint; b: bigint; c: bigint; program: number[] }

const execute = (computer: Computer) => {
  let pointer = 0
  const output: number[] = []
  while (computer.program[pointer] !== undefined) {
    const operand = computer.program[pointer + 1]!
    const instruction = computer.program[pointer]
    switch (instruction) {
      case 0:
        computer.a /= 2n ** getComboOperand(operand, computer)
        break
      case 1:
        computer.b ^= BigInt(operand)
        break
      case 2:
        computer.b = getComboOperand(operand, computer) % 8n
        break
      case 3:
        pointer = computer.a === 0n ? pointer + 2 : operand
        break
      case 4:
        computer.b ^= computer.c
        break
      case 5:
        output.push(Number(getComboOperand(operand, computer) % 8n))
        break
      case 6:
        computer.b = computer.a / 2n ** getComboOperand(operand, computer)
        break
      case 7:
        computer.c = computer.a / 2n ** getComboOperand(operand, computer)
    }
    if (instruction !== 3) {
      pointer += 2
    }
  }
  return output.join(',')
}

const getComboOperand = (operand: number, computer: Computer): bigint => {
  if (operand <= 3) {
    return BigInt(operand)
  }
  const mapping = {
    4: computer.a,
    5: computer.b,
    6: computer.c
  }
  return mapping[operand as 4 | 5 | 6]
}
